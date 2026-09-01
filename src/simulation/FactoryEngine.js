import { RECIPES, BUILDINGS, DIR_VECTORS } from '../core/Constants.js';
import { audioManager } from '../core/AudioManager.js';

export class FactoryEngine {
  constructor(grid, logisticsEngine, milestoneManager) {
    this.grid = grid;
    this.logistics = logisticsEngine;
    this.milestoneManager = milestoneManager;
    
    // Telemetry tracking
    this.rateHistory = {}; // { itemId: { produced: 0, consumed: 0, lastProduced: 0, lastConsumed: 0 } }
    this.rateTimer = 0;
  }

  update(deltaSec) {
    // 1. Process Drills
    const drills = this.grid.buildings.filter(b => 
      b.type === 'burner_drill' || b.type === 'electric_drill' || b.type === 'deep_drill'
    );
    drills.forEach(drill => this.processDrill(drill, deltaSec));

    // 2. Process Smelters and Assemblers
    const processors = this.grid.buildings.filter(b => 
      ['smelter_mk1', 'smelter_mk2', 'assembler_mk1', 'assembler_mk2'].includes(b.type)
    );
    processors.forEach(proc => this.processProcessor(proc, deltaSec));

    // 3. Process Storage Silo automatic output
    const silos = this.grid.buildings.filter(b => b.type === 'storage_chest');
    silos.forEach(silo => this.processStorageSilo(silo, deltaSec));

    // 4. Delivery Stations retain their inputs until the player submits them
    // from the inspector. This keeps belt deliveries visible and prevents a
    // station from appearing to reject items as soon as they arrive.

    // 5. Update telemetry rate counters (rolling 1-minute throughput)
    this.rateTimer += deltaSec;
    if (this.rateTimer >= 5.0) { // update telemetry every 5s
      this.rateTimer = 0;
      Object.keys(this.rateHistory).forEach(k => {
        const entry = this.rateHistory[k];
        entry.lastProduced = Math.round((entry.produced / 5) * 60);
        entry.lastConsumed = Math.round((entry.consumed / 5) * 60);
        entry.produced = 0;
        entry.consumed = 0;
      });
    }
  }

  processDrill(drill, deltaSec) {
    // Check ores under drill
    const ores = this.grid.getOresUnderBuilding(drill);
    const oreTypes = Object.keys(ores);
    if (oreTypes.length === 0) return;

    // Primary ore being mined
    const targetOre = oreTypes[0];

    // Power / Fuel condition
    const pDemand = (drill.def && drill.def.powerDemand !== undefined) ? drill.def.powerDemand : (BUILDINGS[drill.type]?.powerDemand || 0);
    const powerEff = drill.powerSatisfied !== undefined ? drill.powerSatisfied : 0.0;
    
    if (pDemand > 0 && powerEff <= 0.05) {
      return; // Absolute hard stop if unpowered
    }

    const rate = (drill.def.miningRate || 1.0) * (pDemand > 0 ? powerEff : 1.0);
    drill.craftProgress = (drill.craftProgress || 0) + rate * deltaSec;

    if (drill.craftProgress >= 1.0) {
      drill.craftProgress -= 1.0;
      
      // Try to eject mined ore onto adjacent tile in drill facing direction
      const ejected = this.ejectItemFromBuilding(drill, targetOre);
      if (ejected) {
        drill.stats.producedTotal++;
        this.trackProduction(targetOre, 1);
      } else {
        // Output blocked
        drill.craftProgress = 1.0; // Wait until unblocked
      }
    }
  }

  processProcessor(proc, deltaSec) {
    if (!proc.recipeId) return;
    const recipe = RECIPES.find(r => r.id === proc.recipeId);
    if (!recipe) return;

    const powerEff = proc.powerSatisfied;
    if (powerEff <= 0.05) return;

    // Check if inputs are available
    let hasAllInputs = true;
    for (const input of recipe.inputs) {
      if ((proc.inputs[input.item] || 0) < input.count) {
        hasAllInputs = false;
        break;
      }
    }

    // Check if output buffer has space (max 50)
    let outputSpace = true;
    for (const output of recipe.outputs) {
      if ((proc.outputs[output.item] || 0) >= 50) {
        outputSpace = false;
        break;
      }
    }

    if (hasAllInputs && outputSpace) {
      const speedMult = proc.def.speedMultiplier || 1.0;
      const progressDelta = (deltaSec * speedMult * powerEff) / recipe.duration;
      proc.craftProgress += progressDelta;

      if (proc.craftProgress >= 1.0) {
        proc.craftProgress = 0.0;

        // Consume inputs
        for (const input of recipe.inputs) {
          proc.inputs[input.item] -= input.count;
          proc.stats.consumedTotal += input.count;
          this.trackConsumption(input.item, input.count);
        }

        // Produce outputs
        for (const output of recipe.outputs) {
          proc.outputs[output.item] = (proc.outputs[output.item] || 0) + output.count;
          proc.stats.producedTotal += output.count;
          this.trackProduction(output.item, output.count);
        }
      }
    }

    // Attempt to eject any finished products in output buffer
    for (const outKey of Object.keys(proc.outputs)) {
      if (proc.outputs[outKey] > 0) {
        const ejected = this.ejectItemFromBuilding(proc, outKey);
        if (ejected) {
          proc.outputs[outKey]--;
        }
      }
    }
  }

  processStorageSilo(silo, deltaSec) {
    // Eject stored goods onto forward conveyor if facing one
    for (const itemKey of Object.keys(silo.inputs)) {
      if (silo.inputs[itemKey] > 0) {
        const ejected = this.ejectItemFromBuilding(silo, itemKey);
        if (ejected) {
          silo.inputs[itemKey]--;
          break;
        }
      }
    }
  }

  processLaunchpad(launchpad, deltaSec) {
    // Check items deposited into launchpad
    for (const itemKey of Object.keys(launchpad.inputs)) {
      const count = launchpad.inputs[itemKey];
      if (count > 0) {
        // Feed into Milestone Manager
        this.milestoneManager.deliverItem(itemKey, count);
        this.trackConsumption(itemKey, count);
        delete launchpad.inputs[itemKey];
      }
    }
  }

  ejectItemFromBuilding(building, itemType) {
    const dir = building.direction;
    const fromDir = (dir + 2) % 4; // enters target from opposite of building output direction

    // Determine all candidate output port coordinates along the facing edge
    const candidatePorts = [];

    if (dir === 0) { // UP
      const outY = building.y - 1;
      for (let dx = 0; dx < building.width; dx++) {
        candidatePorts.push({ x: building.x + dx, y: outY });
      }
    } else if (dir === 1) { // RIGHT
      const outX = building.x + building.width;
      for (let dy = 0; dy < building.height; dy++) {
        candidatePorts.push({ x: outX, y: building.y + dy });
      }
    } else if (dir === 2) { // DOWN
      const outY = building.y + building.height;
      for (let dx = 0; dx < building.width; dx++) {
        candidatePorts.push({ x: building.x + dx, y: outY });
      }
    } else if (dir === 3) { // LEFT
      const outX = building.x - 1;
      for (let dy = 0; dy < building.height; dy++) {
        candidatePorts.push({ x: outX, y: building.y + dy });
      }
    }

    // Try each candidate port along the edge
    for (const port of candidatePorts) {
      const targetBuilding = this.grid.getBuildingAt(port.x, port.y);
      if (targetBuilding && this.logistics.canAcceptItem(targetBuilding, itemType, port.x, port.y)) {
        this.logistics.insertItemIntoBuilding(targetBuilding, itemType, fromDir);
        return true;
      }
    }

    return false;
  }

  trackProduction(itemId, count) {
    if (!this.rateHistory[itemId]) {
      this.rateHistory[itemId] = { produced: 0, consumed: 0, lastProduced: 0, lastConsumed: 0 };
    }
    this.rateHistory[itemId].produced += count;
  }

  trackConsumption(itemId, count) {
    if (!this.rateHistory[itemId]) {
      this.rateHistory[itemId] = { produced: 0, consumed: 0, lastProduced: 0, lastConsumed: 0 };
    }
    this.rateHistory[itemId].consumed += count;
  }

  getProductionRates() {
    return this.rateHistory;
  }
}
