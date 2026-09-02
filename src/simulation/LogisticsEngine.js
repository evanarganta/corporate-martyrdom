import { DIR_VECTORS, BUILDINGS, TILE_SIZE } from '../core/Constants.js';

export class LogisticsEngine {
  constructor(grid) {
    this.grid = grid;
    this.itemsInTransit = [];
  }

  update(deltaSec) {
    const conveyors = this.grid.buildings.filter(b => 
      b.type === 'conveyor_mk1' || b.type === 'conveyor_mk2' || b.type === 'splitter' || b.type === 'merger' || b.type === 'chute_tunnel'
    );

    this.itemsInTransit = [];

    for (const b of conveyors) {
      const beltSpeed = b.def.speed || 1.8;
      const items = b.conveyorItems;

      items.sort((a, b) => b.progress - a.progress);

      for (let i = 0; i < items.length; i++) {
        const itemObj = items[i];
        const nextItem = i > 0 ? items[i - 1] : null;

        const maxAllowed = nextItem ? Math.max(0, nextItem.progress - 0.35) : 1.0;

        if (itemObj.progress < maxAllowed) {
          itemObj.progress = Math.min(maxAllowed, itemObj.progress + beltSpeed * deltaSec);
        }

        if (itemObj.progress >= 0.98) {
          const transferred = this.tryTransferItem(b, itemObj);
          if (transferred) {
            items.splice(i, 1);
            i--;
            continue;
          }
        }

        const outVec = DIR_VECTORS[b.direction];
        const fromDir = itemObj.fromDir !== undefined ? itemObj.fromDir : ((b.direction + 2) % 4);
        
        let worldX, worldY;
        if (fromDir === (b.direction + 2) % 4) {
          worldX = (b.x + 0.5 + outVec.dx * (itemObj.progress - 0.5)) * TILE_SIZE;
          worldY = (b.y + 0.5 + outVec.dy * (itemObj.progress - 0.5)) * TILE_SIZE;
        } else {
          const inVec = DIR_VECTORS[fromDir];
          const entryX = b.x + 0.5 + inVec.dx * 0.5;
          const entryY = b.y + 0.5 + inVec.dy * 0.5;
          const centerX = b.x + 0.5;
          const centerY = b.y + 0.5;
          const exitX = b.x + 0.5 + outVec.dx * 0.5;
          const exitY = b.y + 0.5 + outVec.dy * 0.5;

          const t = itemObj.progress;
          const oneMinusT = 1 - t;
          const px = oneMinusT * oneMinusT * entryX + 2 * oneMinusT * t * centerX + t * t * exitX;
          const py = oneMinusT * oneMinusT * entryY + 2 * oneMinusT * t * centerY + t * t * exitY;

          worldX = px * TILE_SIZE;
          worldY = py * TILE_SIZE;
        }

        this.itemsInTransit.push({
          item: itemObj.item,
          x: worldX,
          y: worldY
        });
      }
    }
  }

  tryTransferItem(sourceBuilding, itemObj) {
    const dir = sourceBuilding.direction;
    const dirVec = DIR_VECTORS[dir];

    if (sourceBuilding.type === 'splitter') {
      const splitDirs = [dir, (dir + 1) % 4, (dir + 3) % 4];
      for (let attempt = 0; attempt < 3; attempt++) {
        const outDir = splitDirs[(sourceBuilding.splitterIndex + attempt) % 3];
        const outVec = DIR_VECTORS[outDir];
        const targetX = sourceBuilding.x + outVec.dx;
        const targetY = sourceBuilding.y + outVec.dy;
        const targetBuilding = this.grid.getBuildingAt(targetX, targetY);

        if (targetBuilding && this.canAcceptItem(targetBuilding, itemObj.item, targetX, targetY)) {
          this.insertItemIntoBuilding(targetBuilding, itemObj.item, (outDir + 2) % 4);
          sourceBuilding.splitterIndex = (sourceBuilding.splitterIndex + attempt + 1) % 3;
          return true;
        }
      }
      return false;
    }

    if (sourceBuilding.type === 'chute_tunnel') {
      const dist = sourceBuilding.def.tunnelDistance || 5;
      for (let step = 1; step <= dist; step++) {
        const tx = sourceBuilding.x + dirVec.dx * step;
        const ty = sourceBuilding.y + dirVec.dy * step;
        const b = this.grid.getBuildingAt(tx, ty);
        if (b && b.type === 'chute_tunnel' && b.direction === dir) {
          if (this.canAcceptItem(b, itemObj.item, tx, ty)) {
            this.insertItemIntoBuilding(b, itemObj.item, (dir + 2) % 4);
            return true;
          }
          return false;
        }
      }
    }

    const targetX = sourceBuilding.x + dirVec.dx;
    const targetY = sourceBuilding.y + dirVec.dy;
    const targetBuilding = this.grid.getBuildingAt(targetX, targetY);

    if (targetBuilding && this.canAcceptItem(targetBuilding, itemObj.item, targetX, targetY)) {
      const entryDirection = (dir + 2) % 4;
      this.insertItemIntoBuilding(targetBuilding, itemObj.item, entryDirection);
      return true;
    }

    return false;
  }

  canAcceptItem(building, itemType, targetX, targetY) {
    if (!building) return false;

    if (['conveyor_mk1', 'conveyor_mk2', 'splitter', 'merger', 'chute_tunnel'].includes(building.type)) {
      if (building.conveyorItems.length >= 3) return false;
      if (building.conveyorItems.length > 0) {
        const minProgress = Math.min(...building.conveyorItems.map(it => it.progress));
        if (minProgress < 0.32) return false;
      }
      return true;
    }

    if (building.type === 'storage_chest') {
      const totalStored = Object.values(building.inputs).reduce((a, b) => a + b, 0);
      return totalStored < building.def.capacity;
    }

    if (building.type === 'launchpad') {
      return true;
    }

    if (building.type === 'coal_generator') {
      if (itemType !== 'coal') return false;
      return (building.inputs['coal'] || 0) < 50;
    }

    if (['smelter_mk1', 'smelter_mk2', 'assembler_mk1', 'assembler_mk2'].includes(building.type)) {
      if (!building.recipeId) return false;
      const currentInput = building.inputs[itemType] || 0;
      return currentInput < 30;
    }

    return false;
  }

  insertItemIntoBuilding(building, itemType, fromDir = null) {
    if (['conveyor_mk1', 'conveyor_mk2', 'splitter', 'merger', 'chute_tunnel'].includes(building.type)) {
      building.conveyorItems.push({
        item: itemType,
        progress: 0.0,
        fromDir: fromDir !== null ? fromDir : ((building.direction + 2) % 4)
      });
      return;
    }

    building.inputs[itemType] = (building.inputs[itemType] || 0) + 1;
    building.stats.consumedTotal++;
  }
}
