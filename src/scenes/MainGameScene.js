import Phaser from 'phaser';
import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, BUILDINGS, DIR_VECTORS, DIR_ANGLES } from '../core/Constants.js';
import { TextureGenerator } from '../core/TextureGenerator.js';
import { audioManager } from '../core/AudioManager.js';

export class MainGameScene extends Phaser.Scene {
  constructor() {
    super('MainGameScene');

    this.grid = null;
    this.powerGrid = null;
    this.logistics = null;
    this.factory = null;
    this.milestoneManager = null;
    this.economy = null;
    this.uiManager = null;

    this.activeTool = null;
    this.placementDirection = 0;
    this.isDraggingBuild = false;
    this.lastDraggedTile = { x: -1, y: -1 };
    this.hoverTile = { x: 0, y: 0 };
    this.selectedBuilding = null;

    this.terrainLayer = null;
    this.oreLayer = null;
    this.buildingGraphics = null;
    this.powerLineGraphics = null;
    this.itemGraphics = null;
    this.ghostGraphics = null;
    this.particleEmitter = null;

    this.conveyorAnimFrame = 0;
    this.animTimer = 0;

    this.gameSpeed = 1.0;
  }

  initSimulation(data) {
    if (!data) return;
    this.grid = data.grid;
    this.powerGrid = data.powerGrid;
    this.logistics = data.logistics;
    this.factory = data.factory;
    this.milestoneManager = data.milestoneManager;
    this.economy = data.economy;
  }

  create() {
    TextureGenerator.generateAll(this);

    const worldPixelWidth = WORLD_WIDTH * TILE_SIZE;
    const worldPixelHeight = WORLD_HEIGHT * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, worldPixelWidth, worldPixelHeight);
    this.cameras.main.setZoom(1.0);
    this.cameras.main.centerOn(worldPixelWidth / 2, worldPixelHeight / 2);

    this.createWorldLayers();

    this.setupCameraControls();
    this.setupInteractionControls();
    if (this.input.mouse) this.input.mouse.disableContextMenu();

    if (this.grid) {
      this.renderStaticWorld();
    }
  }

  createWorldLayers() {
    this.terrainLayer = this.add.graphics().setDepth(0);
    this.oreLayer = this.add.graphics().setDepth(1);
    this.buildingGraphics = this.add.graphics().setDepth(10);
    this.powerLineGraphics = this.add.graphics().setDepth(15);
    this.itemGraphics = this.add.graphics().setDepth(20);
    this.ghostGraphics = this.add.graphics().setDepth(30);

    this.smokeParticles = this.add.particles(0, 0, 'part_smoke', {
      lifespan: 1200,
      speed: { min: 10, max: 25 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.5, end: 1.2 },
      alpha: { start: 0.6, end: 0 },
      emitting: false
    }).setDepth(25);
  }

  renderStaticWorld() {
    this.terrainLayer.clear();
    this.oreLayer.clear();

    const s = TILE_SIZE;

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        const px = x * s;
        const py = y * s;
        this.terrainLayer.fillStyle(0x141c2b, 1);
        this.terrainLayer.fillRect(px, py, s, s);
        this.terrainLayer.lineStyle(1, 0x1b263b, 0.6);
        this.terrainLayer.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);

        const tile = this.grid.getTileAt(x, y);
        if (tile && tile.ore) {
          const oreTexKey = `ore_${tile.ore.replace('_ore', '')}`;
          this.add.image(px + s / 2, py + s / 2, oreTexKey).setDepth(1);
        }
      }
    }
  }

  setupCameraControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const zoom = this.cameras.main.zoom;
      const newZoom = Phaser.Math.Clamp(zoom - deltaY * 0.0015, 0.4, 2.5);
      this.cameras.main.setZoom(newZoom);
    });

    this.isMousePanning = false;
    this.panStartPos = { x: 0, y: 0 };

    this.input.on('pointerdown', (pointer) => {
      if (pointer.middleButtonDown() || pointer.rightButtonDown() || (!this.activeTool && pointer.leftButtonDown())) {
        this.isMousePanning = true;
        this.panStartPos = { x: pointer.x, y: pointer.y };
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (this.isMousePanning && (pointer.isDown || pointer.middleButtonDown() || pointer.rightButtonDown())) {
        const dx = (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
        const dy = (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
        this.cameras.main.scrollX -= dx;
        this.cameras.main.scrollY -= dy;
      }
    });

    this.input.on('pointerup', () => {
      this.isMousePanning = false;
    });
  }

  setupInteractionControls() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key;

      if (key >= '1' && key <= '9') {
        const slotIdx = parseInt(key, 10) - 1;
        if (this.uiManager) {
          this.uiManager.selectHotbarSlotByIndex(slotIdx);
        }
        return;
      }

      const lowerKey = key.toLowerCase();
      if (lowerKey === 'z') { if (this.uiManager) this.uiManager.switchCategory('logistics'); }
      else if (lowerKey === 'x') { if (this.uiManager) this.uiManager.switchCategory('extraction'); }
      else if (lowerKey === 'c') { if (this.uiManager) this.uiManager.switchCategory('processing'); }
      else if (lowerKey === 'v') { if (this.uiManager) this.uiManager.switchCategory('power'); }
      else if (lowerKey === 'b') { if (this.uiManager) this.uiManager.switchCategory('logistics_adv'); }
      else if (lowerKey === 'e' || key === 'Enter') {
        if (this.uiManager && this.uiManager.hasOpenConfirmModal()) {
          this.uiManager.confirmPendingAction();
        } else if (this.activeTool === 'demolish') {
          const b = this.grid.getBuildingAt(this.hoverTile.x, this.hoverTile.y);
          if (b) {
            if (e.shiftKey && b.type.startsWith('conveyor')) {
              this.demolishConnectedLine(b);
              if (this.uiManager) this.uiManager.showToast('Conveyor line demolished.', 'warn');
            } else {
              this.demolishAt(this.hoverTile.x, this.hoverTile.y);
            }
          }
        } else if (this.activeTool) {
          this.placeAt(this.hoverTile.x, this.hoverTile.y);
        }
      }
      else if (lowerKey === 'q') {
        if (this.uiManager && this.uiManager.hasOpenConfirmModal()) {
          this.uiManager.cancelPendingAction();
        } else if (this.activeTool) {
          this.setTool(null);
        } else {
          this.setTool('demolish');
        }
      }
      else if (lowerKey === 'r') {
        if (this.activeTool && this.activeTool !== 'demolish') {
          const bDef = BUILDINGS[this.activeTool];
          if (!bDef || bDef.directional !== false) {
            this.placementDirection = (this.placementDirection + 1) % 4;
            audioManager.playRotate();
          }
        }
      }
      else if (key === 'Escape') {
        this.setTool(null);
        if (this.uiManager) this.uiManager.closeAllModals();
      }
      else if (lowerKey === 't') { if (this.uiManager) this.uiManager.toggleModal('milestones'); }
      else if (lowerKey === 'p') { if (this.uiManager) this.uiManager.toggleModal('stats'); }
      else if (lowerKey === 'h') { if (this.uiManager) this.uiManager.toggleModal('help'); }
      else if (lowerKey === 'm') {
        const isEnabled = audioManager.toggleSound();
        const audioBtn = document.getElementById('btn-toggle-audio');
        if (audioBtn) audioBtn.textContent = isEnabled ? 'SND' : 'MUT';
      }
      else if (key === ' ') {
        this.gameSpeed = this.gameSpeed === 0 ? 1.0 : 0.0;
        document.querySelectorAll('.speed-controls .btn-icon').forEach(b => b.classList.remove('active'));
        const activeBtnId = this.gameSpeed === 0 ? 'btn-speed-pause' : 'btn-speed-1x';
        const b = document.getElementById(activeBtnId);
        if (b) b.classList.add('active');
        audioManager.playUiClick();
      }
    });

    this.input.on('pointerdown', (pointer) => {
      if (this.activeTool === 'wire_tool' && pointer.rightButtonDown()) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const wire = this.getWireAtWorldPoint(worldPoint.x, worldPoint.y);
        if (wire && this.grid.removeWire(wire.id)) {
          this.wireStartBuilding = null;
          audioManager.playDemolish();
          if (this.uiManager) this.uiManager.showToast('Power cable removed.', 'info');
        }
        return;
      }

      if (pointer.leftButtonDown()) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const gx = Math.floor(worldPoint.x / TILE_SIZE);
        const gy = Math.floor(worldPoint.y / TILE_SIZE);

        if (this.activeTool === 'wire_tool') {
          const b = this.grid.getBuildingAt(gx, gy);
          if (b) {
            if (!this.wireStartBuilding) {
              if (!this.grid.canTransmitPower(b)) {
                if (this.uiManager) this.uiManager.showToast('Start cables from a generator, pole, or accumulator output.', 'warn');
              } else {
                this.wireStartBuilding = b;
                audioManager.playUiClick();
                if (this.uiManager) this.uiManager.showToast(`Selected ${b.def.name}. Click a powered building or power node. Right-click a cable to remove it.`, 'info');
              }
            } else if (this.wireStartBuilding.id === b.id) {
              this.wireStartBuilding = null;
              if (this.uiManager) this.uiManager.showToast('Cable link cancelled.', 'info');
            } else {
              const existingWire = this.grid.getWireBetween(this.wireStartBuilding, b);
              if (existingWire) {
                this.grid.removeWire(existingWire.id);
                this.wireStartBuilding = null;
                audioManager.playDemolish();
                if (this.uiManager) this.uiManager.showToast('Power cable removed.', 'info');
              } else {
                const cableCost = this.economy.getBuildingCost(BUILDINGS.wire_tool);
                if (!this.economy.canAfford(cableCost)) {
                  if (this.uiManager) this.uiManager.showToast(`Insufficient credits for cable: ${this.economy.format(cableCost)} required.`, 'warn');
                  return;
                }
                const wire = this.grid.addWire(this.wireStartBuilding, b);
                if (wire) {
                  this.economy.spend(cableCost);
                  audioManager.playPlace();
                  if (this.uiManager) this.uiManager.showToast(`Cable installed for ${this.economy.format(cableCost)}.`, 'success');
                  this.wireStartBuilding = null;
                } else {
                  if (this.uiManager) this.uiManager.showToast('Target is outside this power connection\'s range.', 'warn');
                }
              }
            }
          } else {
            this.wireStartBuilding = null;
          }
        } else if (this.activeTool === 'demolish') {
          const b = this.grid.getBuildingAt(gx, gy);
          if (b) {
            if (pointer.event.shiftKey && b.type.startsWith('conveyor')) {
              this.demolishConnectedLine(b);
              if (this.uiManager) this.uiManager.showToast('Conveyor line demolished.', 'warn');
            } else {
              this.demolishAt(gx, gy);
            }
          }
          this.isDraggingBuild = true;
          this.lastDraggedTile = { x: gx, y: gy };
        } else if (this.activeTool) {
          this.placeAt(gx, gy);
          this.isDraggingBuild = true;
          this.lastDraggedTile = { x: gx, y: gy };
        }
      }
    });

    this.input.on('pointermove', (pointer) => {
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const gx = Math.floor(worldPoint.x / TILE_SIZE);
      const gy = Math.floor(worldPoint.y / TILE_SIZE);

      this.hoverTile = { x: gx, y: gy };

      if (this.isDraggingBuild && pointer.leftButtonDown()) {
        if (gx !== this.lastDraggedTile.x || gy !== this.lastDraggedTile.y) {
          if (this.activeTool === 'demolish') {
            this.demolishAt(gx, gy);
          } else if (this.activeTool && this.activeTool.startsWith('conveyor')) {
            const dx = gx - this.lastDraggedTile.x;
            const dy = gy - this.lastDraggedTile.y;
            if (dx > 0) this.placementDirection = 1;
            else if (dx < 0) this.placementDirection = 3;
            else if (dy > 0) this.placementDirection = 2;
            else if (dy < 0) this.placementDirection = 0;

            this.placeAt(gx, gy);
          }
          this.lastDraggedTile = { x: gx, y: gy };
        }
      }
    });

    this.input.on('pointerup', (pointer) => {
      if (!this.activeTool && pointer.leftButtonReleased()) {
        const movedDist = Math.hypot(pointer.x - this.panStartPos.x, pointer.y - this.panStartPos.y);
        if (movedDist < 6) {
          const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
          const gx = Math.floor(worldPoint.x / TILE_SIZE);
          const gy = Math.floor(worldPoint.y / TILE_SIZE);
          const b = this.grid.getBuildingAt(gx, gy);
          this.selectedBuilding = b;
          if (this.uiManager) {
            this.uiManager.inspectBuilding(b);
          }
        }
      }

      this.isDraggingBuild = false;
      this.lastDraggedTile = { x: -1, y: -1 };
    });
  }

  setTool(toolName) {
    this.activeTool = toolName;
    this.wireStartBuilding = null;
    if (this.uiManager) {
      this.uiManager.updateToolPill(toolName);
    }
  }

  placeAt(gx, gy) {
    if (!this.activeTool || this.activeTool === 'demolish' || this.activeTool === 'wire_tool') return;

    const bDef = BUILDINGS[this.activeTool];
    if (!bDef) return;

    const cost = this.economy.getBuildingCost(bDef);
    if (!this.economy.canAfford(cost)) {
      if (this.uiManager) this.uiManager.showToast(`Insufficient credits: ${this.economy.format(cost)} required for ${bDef.name}.`, 'warn');
      return;
    }

    if (this.grid.canPlaceBuilding(this.activeTool, gx, gy)) {
      const inst = this.grid.placeBuilding(this.activeTool, gx, gy, this.placementDirection);
      if (inst) {
        this.economy.spend(cost);
        audioManager.playPlace();
        if (this.uiManager) this.uiManager.refreshEconomy();
      }
    }
  }

  demolishAt(gx, gy) {
    const b = this.grid.getBuildingAt(gx, gy);
    if (b) {
      if (b.isStarterHub) {
        if (this.uiManager) this.uiManager.showToast('The Central Delivery Station is a protected mission facility.', 'warn');
        return;
      }
      const recoveredItems = {};
      [b.inputs, b.outputs].forEach(inventory => {
        Object.entries(inventory || {}).forEach(([item, count]) => {
          recoveredItems[item] = (recoveredItems[item] || 0) + count;
        });
      });
      (b.conveyorItems || []).forEach(item => {
        recoveredItems[item.item] = (recoveredItems[item.item] || 0) + 1;
      });
      const refund = this.economy.refundBuilding(b);
      const cargoValue = this.economy.sellItems(recoveredItems);
      this.grid.removeBuilding(b);
      audioManager.playDemolish();
      if (this.uiManager) {
        this.uiManager.refreshEconomy(refund);
        if (cargoValue > 0) this.uiManager.showToast(`Recovered cargo liquidated for ${this.economy.format(cargoValue)}.`, 'info');
      }
      if (this.selectedBuilding === b) {
        this.selectedBuilding = null;
        if (this.uiManager) this.uiManager.inspectBuilding(null);
      }
    }
  }

  demolishConnectedLine(startBuilding) {
    if (!startBuilding || !startBuilding.type.startsWith('conveyor')) return;

    const queue = [startBuilding];
    const visited = new Set([startBuilding.id]);
    const toRemove = [startBuilding];

    while (queue.length > 0) {
      const cur = queue.shift();
      const neighbors = [
        this.grid.getBuildingAt(cur.x, cur.y - 1),
        this.grid.getBuildingAt(cur.x + 1, cur.y),
        this.grid.getBuildingAt(cur.x, cur.y + 1),
        this.grid.getBuildingAt(cur.x - 1, cur.y)
      ];

      neighbors.forEach(nb => {
        if (nb && nb.type.startsWith('conveyor') && !visited.has(nb.id)) {
          visited.add(nb.id);
          toRemove.push(nb);
          queue.push(nb);
        }
      });
    }

    let refund = 0;
    toRemove.forEach(b => {
      refund += this.economy.refundBuilding(b);
      this.grid.removeBuilding(b);
    });
    audioManager.playDemolish();
    this.selectedBuilding = null;
    if (this.uiManager) {
      this.uiManager.inspectBuilding(null);
      this.uiManager.refreshEconomy(refund);
    }
  }

  getWireAtWorldPoint(worldX, worldY) {
    const hitDistance = 10 / this.cameras.main.zoom;
    let closestWire = null;
    let closestDistance = hitDistance;

    for (const wire of this.grid.wires || []) {
      const x1 = wire.x1 * TILE_SIZE;
      const y1 = wire.y1 * TILE_SIZE;
      const x2 = wire.x2 * TILE_SIZE;
      const y2 = wire.y2 * TILE_SIZE;
      const distance = this.distanceToWireCurve(worldX, worldY, x1, y1, x2, y2);
      if (distance <= closestDistance) {
        closestWire = wire;
        closestDistance = distance;
      }
    }

    return closestWire;
  }

  distanceToWireCurve(px, py, x1, y1, x2, y2) {
    const distance = Math.hypot(x2 - x1, y2 - y1);
    const sag = Math.min(26, distance * 0.08);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + sag;
    let nearest = Infinity;
    let lastX = x1;
    let lastY = y1;

    for (let step = 1; step <= 12; step++) {
      const t = step / 12;
      const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
      const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
      nearest = Math.min(nearest, this.distanceToLineSegment(px, py, lastX, lastY, x, y));
      lastX = x;
      lastY = y;
    }

    return nearest;
  }

  distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  renderPowerLines() {
    this.powerLineGraphics.clear();
    const wires = this.grid ? (this.grid.wires || []) : [];
    const s = TILE_SIZE;

    wires.forEach(w => {
      const p1x = w.x1 * s;
      const p1y = w.y1 * s;
      const p2x = w.x2 * s;
      const p2y = w.y2 * s;

      const dist = Math.hypot(p2x - p1x, p2y - p1y);
      const sag = Math.min(26, dist * 0.08);
      const midX = (p1x + p2x) / 2;
      const midY = (p1y + p2y) / 2 + sag;

      const b1 = this.grid.getBuildingById(w.fromId);
      const b2 = this.grid.getBuildingById(w.toId);
      const isEnergized = (b1 && b1.powerSatisfied > 0.1) || (b2 && b2.powerSatisfied > 0.1);

      if (isEnergized) {
        this.powerLineGraphics.lineStyle(3.5, 0xf1c40f, 0.35);
        this.drawCatenaryCurve(p1x, p1y, midX, midY, p2x, p2y);

        this.powerLineGraphics.lineStyle(1.5, 0xfff099, 0.95);
        this.drawCatenaryCurve(p1x, p1y, midX, midY, p2x, p2y);
      } else {
        this.powerLineGraphics.lineStyle(1.5, 0x85929e, 0.65);
        this.drawCatenaryCurve(p1x, p1y, midX, midY, p2x, p2y);
      }

      this.powerLineGraphics.fillStyle(0x1e293b, 1);
      this.powerLineGraphics.fillCircle(p1x, p1y, 3);
      this.powerLineGraphics.fillCircle(p2x, p2y, 3);
    });

    if (this.wireStartBuilding && this.activeTool === 'wire_tool') {
      const p1x = (this.wireStartBuilding.x + this.wireStartBuilding.width / 2) * s;
      const p1y = (this.wireStartBuilding.y + this.wireStartBuilding.height / 2) * s;

      const pointer = this.input.activePointer;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const p2x = worldPoint.x;
      const p2y = worldPoint.y;

      const target = this.grid.getBuildingAt(Math.floor(p2x / s), Math.floor(p2y / s));
      const isValid = Boolean(target) && this.grid.canConnectToPower(target) && this.grid.canWireReach(this.wireStartBuilding, target);

      const dist = Math.hypot(p2x - p1x, p2y - p1y);
      const sag = Math.min(26, dist * 0.08);
      const midX = (p1x + p2x) / 2;
      const midY = (p1y + p2y) / 2 + sag;

      this.powerLineGraphics.lineStyle(2, isValid ? 0xf1c40f : 0xe74c3c, 0.9);
      this.drawCatenaryCurve(p1x, p1y, midX, midY, p2x, p2y);

      this.powerLineGraphics.fillStyle(isValid ? 0xf1c40f : 0xe74c3c, 1);
      this.powerLineGraphics.fillCircle(p1x, p1y, 4);
    }
  }

  drawCatenaryCurve(x1, y1, cx, cy, x2, y2) {
    const steps = 12;
    for (let i = 0; i < steps; i++) {
      const t1 = i / steps;
      const t2 = (i + 1) / steps;
      
      const qx1 = (1 - t1) * (1 - t1) * x1 + 2 * (1 - t1) * t1 * cx + t1 * t1 * x2;
      const qy1 = (1 - t1) * (1 - t1) * y1 + 2 * (1 - t1) * t1 * cy + t1 * t1 * y2;
      const qx2 = (1 - t2) * (1 - t2) * x1 + 2 * (1 - t2) * t2 * cx + t2 * t2 * x2;
      const qy2 = (1 - t2) * (1 - t2) * y1 + 2 * (1 - t2) * t2 * cy + t2 * t2 * y2;

      this.powerLineGraphics.lineBetween(qx1, qy1, qx2, qy2);
    }
  }

  update(time, delta) {
    const deltaSec = (delta / 1000) * this.gameSpeed;

    const panSpeed = 600 / this.cameras.main.zoom;
    if (this.keyA.isDown || this.cursors.left.isDown) this.cameras.main.scrollX -= panSpeed * (delta / 1000);
    if (this.keyD.isDown || this.cursors.right.isDown) this.cameras.main.scrollX += panSpeed * (delta / 1000);
    if (this.keyW.isDown || this.cursors.up.isDown) this.cameras.main.scrollY -= panSpeed * (delta / 1000);
    if (this.keyS.isDown || this.cursors.down.isDown) this.cameras.main.scrollY += panSpeed * (delta / 1000);

    this.animTimer += deltaSec * 8;
    if (this.animTimer >= 1.0) {
      this.animTimer = 0;
      this.conveyorAnimFrame = (this.conveyorAnimFrame + 1) % 4;
    }

    if (this.powerGrid) this.powerGrid.update(deltaSec);
    if (this.logistics) this.logistics.update(deltaSec);
    if (this.factory) this.factory.update(deltaSec);

    this.renderBuildings();
    this.renderPowerLines();
    this.renderItems();
    this.renderGhostPreview();

    if (this.uiManager) {
      this.uiManager.updateHUD(this.hoverTile);
    }
  }

  renderBuildings() {
    this.buildingGraphics.clear();
    if (!this.grid) return;
    const s = TILE_SIZE;

    this.grid.buildings.forEach(b => {
      const px = b.x * s;
      const py = b.y * s;
      const pw = b.width * s;
      const ph = b.height * s;

      if (b.type === 'conveyor_mk1' || b.type === 'conveyor_mk2') {
        const outDir = b.direction;
        const oppDir = (outDir + 2) % 4;

        const upB = this.grid.getBuildingAt(b.x, b.y - 1);
        const rightB = this.grid.getBuildingAt(b.x + 1, b.y);
        const downB = this.grid.getBuildingAt(b.x, b.y + 1);
        const leftB = this.grid.getBuildingAt(b.x - 1, b.y);

        const feedsFrom = [
          upB && (upB.direction === 2 || (upB.def && upB.def.width > 1 && upB.direction === 2)),
          rightB && (rightB.direction === 3 || (rightB.def && rightB.def.width > 1 && rightB.direction === 3)),
          downB && (downB.direction === 0 || (downB.def && downB.def.width > 1 && downB.direction === 0)),
          leftB && (leftB.direction === 1 || (leftB.def && leftB.def.width > 1 && leftB.direction === 1))
        ];

        const isCorner = !feedsFrom[oppDir] && (feedsFrom[(outDir + 1) % 4] || feedsFrom[(outDir + 3) % 4]);
        const cornerInDir = feedsFrom[(outDir + 1) % 4] ? ((outDir + 1) % 4) : (feedsFrom[(outDir + 3) % 4] ? ((outDir + 3) % 4) : null);

        const angle = DIR_ANGLES[outDir];
        const isMk2 = b.type === 'conveyor_mk2';
        const accentColor = isMk2 ? 0x00f0ff : 0xffb703;

        this.buildingGraphics.save();
        this.buildingGraphics.translateCanvas(px + s / 2, py + s / 2);
        this.buildingGraphics.rotateCanvas(Phaser.Math.DegToRad(angle));

        this.buildingGraphics.fillStyle(0x1e293b, 1);
        this.buildingGraphics.fillRect(-s / 2, -s / 2, s, s);

        const trackColor = isMk2 ? 0x09131f : 0x0f172a;
        const railColor = isMk2 ? 0x00f0ff : 0x475569;

        this.buildingGraphics.fillStyle(trackColor, 1);
        this.buildingGraphics.fillRect(-s / 2 + 5, -s / 2, s - 10, s);
        this.buildingGraphics.fillStyle(railColor, 1);
        this.buildingGraphics.fillRect(-s / 2, -s / 2, 5, s);
        this.buildingGraphics.fillRect(s / 2 - 5, -s / 2, 5, s);

        if (isCorner && cornerInDir !== null) {
          const relInDir = (cornerInDir - outDir + 4) % 4;
          const openingHeight = 28;

          this.buildingGraphics.fillRect(-s / 2, s / 2 - 5, s, 5);
          this.buildingGraphics.fillStyle(trackColor, 1);
          if (relInDir === 1) {
            this.buildingGraphics.fillRect(s / 2 - 5, -openingHeight / 2, 5, openingHeight);
          } else {
            this.buildingGraphics.fillRect(-s / 2, -openingHeight / 2, 5, openingHeight);
          }
        }

        const offset = (this.conveyorAnimFrame * (s / 4)) % s;
        this.buildingGraphics.fillStyle(railColor, 0.75);
        for (let yOff = -s; yOff < s * 2; yOff += 12) {
          const cy = (yOff + offset) % s - s / 2;
          if (cy >= -s / 2 && cy < s / 2 - 3) {
            this.buildingGraphics.fillRect(-s / 2 + 6, cy, s - 12, 3);
          }
        }

        this.buildingGraphics.fillStyle(accentColor, 0.95);
        this.buildingGraphics.fillTriangle(0, -s / 2 + 6, -7, -s / 2 + 20, 7, -s / 2 + 20);

        this.buildingGraphics.restore();
        return;
      }

      let fillColor = 0x334155;
      let strokeColor = 0x64748b;

      if (b.type.includes('drill')) {
        fillColor = b.type === 'electric_drill' ? 0x1e293b : (b.type === 'deep_drill' ? 0x0f172a : 0x334155);
        strokeColor = b.type === 'electric_drill' ? 0x00f0ff : (b.type === 'deep_drill' ? 0x818cf8 : 0xffb703);
      } else if (b.type.includes('smelter')) {
        fillColor = b.type === 'smelter_mk2' ? 0x0f172a : 0x334155;
        strokeColor = b.type === 'smelter_mk2' ? 0x06b6d4 : 0xf97316;
      } else if (b.type.includes('assembler')) {
        fillColor = b.type === 'assembler_mk2' ? 0x0f172a : 0x1e293b;
        strokeColor = b.type === 'assembler_mk2' ? 0xec4899 : 0x10b981;
      } else if (b.type === 'power_pole') {
        fillColor = 0x475569;
        strokeColor = 0xffd166;
      } else if (b.type === 'coal_generator') {
        fillColor = 0x1e293b;
        strokeColor = 0xffd166;
      } else if (b.type === 'solar_panel') {
        fillColor = 0x0f172a;
        strokeColor = 0x38bdf8;
      } else if (b.type === 'launchpad') {
        fillColor = 0x0f172a;
        strokeColor = 0x00f0ff;
      }

      this.buildingGraphics.fillStyle(fillColor, 1);
      this.buildingGraphics.fillRect(px + 3, py + 3, pw - 6, ph - 6);
      this.buildingGraphics.lineStyle(2, strokeColor, 1);
      this.buildingGraphics.strokeRect(px + 3, py + 3, pw - 6, ph - 6);

      if (b.type.includes('drill')) {
        this.buildingGraphics.fillStyle(0x0f172a, 1);
        this.buildingGraphics.fillCircle(px + pw / 2, py + ph / 2, pw * 0.3);
        this.buildingGraphics.fillStyle(strokeColor, 0.9);
        this.buildingGraphics.fillCircle(px + pw / 2, py + ph / 2, pw * 0.22);
        this.buildingGraphics.fillStyle(0xffffff, 0.9);
        this.buildingGraphics.fillCircle(px + pw / 2, py + ph / 2, pw * 0.1);
      } else if (b.type.includes('smelter')) {
        this.buildingGraphics.fillStyle(0x7c2d12, 1);
        this.buildingGraphics.fillCircle(px + pw / 2, py + ph / 2, pw * 0.32);
        this.buildingGraphics.fillStyle(0xf97316, 0.95);
        this.buildingGraphics.fillCircle(px + pw / 2, py + ph / 2, pw * 0.22);
        this.buildingGraphics.fillStyle(0xffffff, 0.9);
        this.buildingGraphics.fillCircle(px + pw / 2, py + ph / 2, pw * 0.1);
      } else if (b.type.includes('assembler')) {
        this.buildingGraphics.lineStyle(4, strokeColor, 1);
        this.buildingGraphics.lineBetween(px + pw * 0.25, py + ph / 2, px + pw * 0.75, py + ph / 2);
        this.buildingGraphics.lineBetween(px + pw / 2, py + ph * 0.25, px + pw / 2, py + ph * 0.75);
      } else if (b.type === 'launchpad') {
        this.buildingGraphics.lineStyle(3, 0x00f0ff, 1);
        this.buildingGraphics.strokeCircle(px + pw / 2, py + ph / 2, pw * 0.32);
        this.buildingGraphics.strokeCircle(px + pw / 2, py + ph / 2, pw * 0.16);
      }

      if (b.def.directional) {
        const dir = b.direction;
        this.buildingGraphics.fillStyle(0xffffff, 0.95);

        if (dir === 0) {
          for (let dx = 0; dx < b.width; dx++) {
            const arrowX = px + (dx + 0.5) * s;
            const arrowY = py + 8;
            this.buildingGraphics.fillTriangle(arrowX, arrowY - 4, arrowX - 5, arrowY + 5, arrowX + 5, arrowY + 5);
          }
        } else if (dir === 1) {
          for (let dy = 0; dy < b.height; dy++) {
            const arrowX = px + pw - 8;
            const arrowY = py + (dy + 0.5) * s;
            this.buildingGraphics.fillTriangle(arrowX + 4, arrowY, arrowX - 5, arrowY - 5, arrowX - 5, arrowY + 5);
          }
        } else if (dir === 2) {
          for (let dx = 0; dx < b.width; dx++) {
            const arrowX = px + (dx + 0.5) * s;
            const arrowY = py + ph - 8;
            this.buildingGraphics.fillTriangle(arrowX, arrowY + 4, arrowX - 5, arrowY - 5, arrowX + 5, arrowY - 5);
          }
        } else if (dir === 3) {
          for (let dy = 0; dy < b.height; dy++) {
            const arrowX = px + 8;
            const arrowY = py + (dy + 0.5) * s;
            this.buildingGraphics.fillTriangle(arrowX - 4, arrowY, arrowX + 5, arrowY - 5, arrowX + 5, arrowY + 5);
          }
        }
      }

      if (this.selectedBuilding === b) {
        this.buildingGraphics.lineStyle(2, 0x00f0ff, 1);
        this.buildingGraphics.strokeRect(px - 2, py - 2, pw + 4, ph + 4);
      }
    });
  }

  renderItems() {
    this.itemGraphics.clear();
    const items = this.logistics ? this.logistics.itemsInTransit : [];

    items.forEach(it => {
      let itemColor = 0xffffff;
      if (it.item === 'iron_ore') itemColor = 0x9ba3af;
      else if (it.item === 'copper_ore') itemColor = 0xd97706;
      else if (it.item === 'coal') itemColor = 0x334155;
      else if (it.item === 'quartz') itemColor = 0x38bdf8;
      else if (it.item === 'titanium_ore') itemColor = 0x818cf8;
      else if (it.item === 'iron_ingot') itemColor = 0xcbd5e1;
      else if (it.item === 'copper_ingot') itemColor = 0xf59e0b;
      else if (it.item === 'silicon_wafer') itemColor = 0x00f0ff;
      else if (it.item === 'titanium_bar') itemColor = 0xa5b4fc;
      else if (it.item === 'iron_plate') itemColor = 0x94a3b8;
      else if (it.item === 'gear') itemColor = 0x64748b;
      else if (it.item === 'copper_wire') itemColor = 0xfbbf24;
      else if (it.item === 'circuit_board') itemColor = 0x10b981;
      else if (it.item === 'microchip') itemColor = 0x06b6d4;
      else if (it.item === 'motor') itemColor = 0x3b82f6;
      else if (it.item === 'reinforced_plate') itemColor = 0x475569;
      else if (it.item === 'energy_cell') itemColor = 0xec4899;
      else if (it.item === 'automation_core') itemColor = 0xf43f5e;

      this.itemGraphics.fillStyle(itemColor, 1);
      this.itemGraphics.fillCircle(it.x, it.y, 7.5);
      this.itemGraphics.lineStyle(1.5, 0xffffff, 0.9);
      this.itemGraphics.strokeCircle(it.x, it.y, 7.5);
    });
  }

  renderGhostPreview() {
    this.ghostGraphics.clear();
    const gx = this.hoverTile.x;
    const gy = this.hoverTile.y;
    const s = TILE_SIZE;

    if (this.activeTool === 'demolish') {
      this.ghostGraphics.fillStyle(0xef476f, 0.4);
      this.ghostGraphics.fillRect(gx * s, gy * s, s, s);
      this.ghostGraphics.lineStyle(2, 0xef476f, 1);
      this.ghostGraphics.strokeRect(gx * s, gy * s, s, s);
      return;
    }

    if (!this.activeTool) return;

    const bDef = BUILDINGS[this.activeTool];
    if (!bDef) return;

    const pw = bDef.width * s;
    const ph = bDef.height * s;
    const px = gx * s;
    const py = gy * s;

    const isValid = this.grid.canPlaceBuilding(this.activeTool, gx, gy);
    const tintColor = isValid ? 0x06d6a0 : 0xef476f;

    this.ghostGraphics.fillStyle(tintColor, 0.35);
    this.ghostGraphics.fillRect(px, py, pw, ph);
    this.ghostGraphics.lineStyle(2, tintColor, 0.9);
    this.ghostGraphics.strokeRect(px, py, pw, ph);

    if (bDef.directional) {
      const dirVec = DIR_VECTORS[this.placementDirection];
      const arrowX = px + pw / 2 + dirVec.dx * (pw / 2 - 10);
      const arrowY = py + ph / 2 + dirVec.dy * (ph / 2 - 10);
      this.ghostGraphics.fillStyle(0xffffff, 0.9);
      this.ghostGraphics.fillCircle(arrowX, arrowY, 6);
    }
  }
}
