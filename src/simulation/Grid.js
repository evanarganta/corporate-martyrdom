import { WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, BUILDINGS } from '../core/Constants.js';

export class Grid {
  constructor(width = WORLD_WIDTH, height = WORLD_HEIGHT) {
    this.width = width;
    this.height = height;
    
    // Matrix of tiles: { type: 'ground' | 'concrete', ore: null | 'iron_ore' | 'copper_ore' | 'coal' | 'quartz' | 'titanium_ore', oreYield: 0 }
    this.tiles = Array.from({ length: height }, () => Array.from({ length: width }, () => ({
      type: 'ground',
      ore: null,
      oreYield: 0
    })));

    // Matrix of building references at each tile
    this.buildingGrid = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
    
    // List of all active building instances
    this.buildings = [];
    
    // Explicit wire network connections: [{ id, fromId, toId, x1, y1, x2, y2 }]
    this.wires = [];

    this.generateWorldOres();
  }

  generateWorldOres() {
    // Generate organic clusters of ores around the map
    const clusters = [
      // Starter area veins (near center: 60, 60)
      { type: 'iron_ore', cx: 54, cy: 55, radius: 5, density: 0.8 },
      { type: 'copper_ore', cx: 66, cy: 54, radius: 4, density: 0.8 },
      { type: 'coal', cx: 55, cy: 66, radius: 5, density: 0.75 },
      { type: 'quartz', cx: 68, cy: 67, radius: 4, density: 0.7 },
      
      // Outer expansion veins
      { type: 'iron_ore', cx: 35, cy: 35, radius: 7, density: 0.85 },
      { type: 'copper_ore', cx: 85, cy: 35, radius: 6, density: 0.85 },
      { type: 'coal', cx: 35, cy: 85, radius: 6, density: 0.85 },
      { type: 'quartz', cx: 85, cy: 85, radius: 5, density: 0.75 },
      { type: 'titanium_ore', cx: 60, cy: 25, radius: 5, density: 0.7 },
      { type: 'titanium_ore', cx: 60, cy: 95, radius: 5, density: 0.7 },
      { type: 'iron_ore', cx: 20, cy: 60, radius: 8, density: 0.9 },
      { type: 'copper_ore', cx: 100, cy: 60, radius: 8, density: 0.9 }
    ];

    clusters.forEach(c => {
      for (let y = c.cy - c.radius; y <= c.cy + c.radius; y++) {
        for (let x = c.cx - c.radius; x <= c.cx + c.radius; x++) {
          if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const dist = Math.hypot(x - c.cx, y - c.cy);
            if (dist <= c.radius && Math.random() < c.density * (1 - (dist / (c.radius + 1)) * 0.4)) {
              this.tiles[y][x].ore = c.type;
              this.tiles[y][x].oreYield = 50000;
            }
          }
        }
      }
    });
  }

  isOutOfBounds(x, y, w = 1, h = 1) {
    return x < 0 || y < 0 || x + w > this.width || y + h > this.height;
  }

  canPlaceBuilding(buildingId, gridX, gridY) {
    const bDef = BUILDINGS[buildingId];
    if (!bDef) return false;

    if (this.isOutOfBounds(gridX, gridY, bDef.width, bDef.height)) {
      return false;
    }

    // Check if any occupied tile overlaps
    for (let dy = 0; dy < bDef.height; dy++) {
      for (let dx = 0; dx < bDef.width; dx++) {
        if (this.buildingGrid[gridY + dy][gridX + dx] !== null) {
          return false;
        }
      }
    }

    return true;
  }

  placeBuilding(buildingId, gridX, gridY, direction = 0) {
    const bDef = BUILDINGS[buildingId];
    if (!this.canPlaceBuilding(buildingId, gridX, gridY)) return null;

    const buildingInstance = {
      id: `${buildingId}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      type: buildingId,
      def: bDef,
      x: gridX,
      y: gridY,
      width: bDef.width,
      height: bDef.height,
      direction: direction,
      
      // Simulation state
      active: true,
      powerSatisfied: (bDef.powerDemand && bDef.powerDemand > 0) ? 0.0 : 1.0, // 0.0 to 1.0
      craftProgress: 0.0,
      recipeId: null,
      
      // Inventory buffers
      inputs: {},  // { itemKey: count }
      outputs: {}, // { itemKey: count }

      // Logistics specifics (e.g. for belts / splitters)
      conveyorItems: [], // [{ item: 'iron_ore', progress: 0.0 }]
      splitterIndex: 0,
      
      // Telemetry
      stats: {
        producedTotal: 0,
        consumedTotal: 0,
        lastMinuteRate: 0
      }
    };

    // Auto-assign default recipe if smelter or assembler
    if (buildingId === 'smelter_mk1' || buildingId === 'smelter_mk2') {
      buildingInstance.recipeId = 'smelt_iron';
    } else if (buildingId === 'assembler_mk1' || buildingId === 'assembler_mk2') {
      buildingInstance.recipeId = 'craft_iron_plate';
    }

    // Register on building occupancy grid
    for (let dy = 0; dy < bDef.height; dy++) {
      for (let dx = 0; dx < bDef.width; dx++) {
        this.buildingGrid[gridY + dy][gridX + dx] = buildingInstance;
      }
    }

    this.buildings.push(buildingInstance);
    return buildingInstance;
  }

  removeBuilding(buildingInstance) {
    if (!buildingInstance) return false;

    // Clear occupancy grid
    for (let dy = 0; dy < buildingInstance.height; dy++) {
      for (let dx = 0; dx < buildingInstance.width; dx++) {
        const gx = buildingInstance.x + dx;
        const gy = buildingInstance.y + dy;
        if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
          if (this.buildingGrid[gy][gx] === buildingInstance) {
            this.buildingGrid[gy][gx] = null;
          }
        }
      }
    }

    const idx = this.buildings.indexOf(buildingInstance);
    if (idx !== -1) {
      this.buildings.splice(idx, 1);
      // Remove all wires connected to this building
      this.removeWiresForBuilding(buildingInstance);
      return true;
    }
    return false;
  }

  addWire(b1, b2) {
    if (!b1 || !b2 || b1 === b2) return null;

    // Cables must originate from power infrastructure. Machines may receive
    // power, but they cannot be used to relay it to another machine.
    if (!this.canTransmitPower(b1) || !this.canConnectToPower(b2)) return null;
    
    // Check if wire between these two already exists
    const existing = this.getWireBetween(b1, b2);
    if (existing) return existing;

    const x1 = b1.x + b1.width / 2;
    const y1 = b1.y + b1.height / 2;
    const x2 = b2.x + b2.width / 2;
    const y2 = b2.y + b2.height / 2;

    if (!this.canWireReach(b1, b2)) return null;

    const wire = {
      id: `wire_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      fromId: b1.id,
      toId: b2.id,
      x1, y1, x2, y2
    };

    this.wires.push(wire);
    return wire;
  }

  getWireBetween(b1, b2) {
    if (!b1 || !b2) return null;
    return this.wires.find(w =>
      (w.fromId === b1.id && w.toId === b2.id) || (w.fromId === b2.id && w.toId === b1.id)
    ) || null;
  }

  canTransmitPower(building) {
    return Boolean(building && (
      building.type === 'power_pole' ||
      (building.def && (building.def.powerOutput || 0) > 0)
    ));
  }

  canConnectToPower(building) {
    return Boolean(building && (
      this.canTransmitPower(building) ||
      (building.def && (building.def.powerDemand || 0) > 0)
    ));
  }

  getWireReach(building) {
    if (!building || !building.def) return 0;
    return building.def.wireReach ?? building.def.supplyRadius ?? Infinity;
  }

  canWireReach(b1, b2) {
    if (!b1 || !b2) return false;
    const x1 = b1.x + b1.width / 2;
    const y1 = b1.y + b1.height / 2;
    const x2 = b2.x + b2.width / 2;
    const y2 = b2.y + b2.height / 2;
    const range = Math.min(this.getWireReach(b1), this.getWireReach(b2));
    return Math.hypot(x1 - x2, y1 - y2) <= range;
  }

  removeWire(wireId) {
    const idx = this.wires.findIndex(w => w.id === wireId);
    if (idx !== -1) {
      this.wires.splice(idx, 1);
      return true;
    }
    return false;
  }

  removeWiresForBuilding(building) {
    this.wires = this.wires.filter(w => w.fromId !== building.id && w.toId !== building.id);
  }

  getBuildingById(id) {
    return this.buildings.find(b => b.id === id) || null;
  }

  getBuildingAt(gridX, gridY) {
    if (this.isOutOfBounds(gridX, gridY)) return null;
    return this.buildingGrid[gridY][gridX];
  }

  getTileAt(gridX, gridY) {
    if (this.isOutOfBounds(gridX, gridY)) return null;
    return this.tiles[gridY][gridX];
  }

  getOresUnderBuilding(building) {
    const oresFound = {};
    for (let dy = 0; dy < building.height; dy++) {
      for (let dx = 0; dx < building.width; dx++) {
        const tile = this.getTileAt(building.x + dx, building.y + dy);
        if (tile && tile.ore) {
          oresFound[tile.ore] = (oresFound[tile.ore] || 0) + 1;
        }
      }
    }
    return oresFound;
  }
}
