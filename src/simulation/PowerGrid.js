import { BUILDINGS } from '../core/Constants.js';

export class PowerGrid {
  constructor(grid) {
    this.grid = grid;
    this.networks = [];
    this.totalProduction = 0;
    this.totalDemand = 0;
    this.globalSatisfaction = 1.0;
  }

  update(deltaSec) {
    const buildings = this.grid.buildings;
    const wires = this.grid.wires || [];

    buildings.forEach(b => {
      if (b.def.powerDemand > 0) {
        b.powerSatisfied = 0.0;
      }
    });

    const adj = new Map();
    buildings.forEach(b => adj.set(b.id, []));

    wires.forEach(w => {
      const b1 = this.grid.getBuildingById(w.fromId);
      const b2 = this.grid.getBuildingById(w.toId);
      if (b1 && b2) {
        if (!adj.has(b1.id)) adj.set(b1.id, []);
        if (!adj.has(b2.id)) adj.set(b2.id, []);
        adj.get(b1.id).push(b2);
        adj.get(b2.id).push(b1);
      }
    });

    const visited = new Set();
    this.networks = [];

    buildings.forEach(root => {
      if (!visited.has(root.id)) {
        const netBuildings = [];
        const queue = [root];
        visited.add(root.id);

        while (queue.length > 0) {
          const cur = queue.shift();
          netBuildings.push(cur);

          const neighbors = adj.get(cur.id) || [];
          neighbors.forEach(nb => {
            if (!visited.has(nb.id)) {
              visited.add(nb.id);
              queue.push(nb);
            }
          });
        }

        const generators = netBuildings.filter(b => (b.def.powerOutput || 0) > 0);
        const consumers = netBuildings.filter(b => (b.def.powerDemand || 0) > 0);
        const accumulators = netBuildings.filter(b => b.type === 'accumulator');
        const poles = netBuildings.filter(b => b.type === 'power_pole');

        if (generators.length > 0 || consumers.length > 0 || poles.length > 0) {
          this.networks.push({
            buildings: netBuildings,
            generators,
            consumers,
            accumulators,
            poles,
            supply: 0,
            demand: 0,
            satisfaction: 1.0,
            storedEnergy: 0,
            maxStorage: 0
          });
        }
      }
    });

    let globalSupply = 0;
    let globalDemand = 0;

    this.networks.forEach(net => {
      let netSupply = 0;
      let netDemand = 0;

      net.consumers.forEach(con => {
        if (con.active) {
          netDemand += (con.def.powerDemand || 0);
        }
      });

      net.generators.forEach(gen => {
        if (gen.type === 'coal_generator') {
          const coalCount = gen.inputs['coal'] || 0;
          if (coalCount > 0) {
            netSupply += (gen.def.powerOutput || 150);
            
            if (netDemand > 0) {
              if (gen.burnProgress === undefined) gen.burnProgress = 0.0;
              gen.burnProgress += (gen.def.fuelPerSec || 0.15) * deltaSec;
              if (gen.burnProgress >= 1.0) {
                const consumedUnits = Math.floor(gen.burnProgress);
                gen.burnProgress -= consumedUnits;
                gen.inputs['coal'] = Math.max(0, (gen.inputs['coal'] || 0) - consumedUnits);
              }
            }
          }
        } else {
          netSupply += (gen.def.powerOutput || 80);
        }
      });

      let netStored = 0;
      let netCapacity = 0;
      net.accumulators.forEach(acc => {
        if (acc.storedEnergy === undefined) acc.storedEnergy = 500;
        netStored += acc.storedEnergy;
        netCapacity += acc.def.capacity;
      });

      let satisfaction = 1.0;
      if (netDemand > 0) {
        if (netSupply >= netDemand) {
          satisfaction = 1.0;
          const surplus = (netSupply - netDemand) * deltaSec;
          if (netCapacity > 0 && netStored < netCapacity) {
            const chargeEach = surplus / net.accumulators.length;
            net.accumulators.forEach(acc => {
              acc.storedEnergy = Math.min(acc.def.capacity, acc.storedEnergy + chargeEach);
            });
          }
        } else {
          const deficit = netDemand - netSupply;
          let dischargeAvailable = 0;
          net.accumulators.forEach(acc => {
            const maxDischarge = Math.min(acc.storedEnergy / Math.max(0.01, deltaSec), acc.def.maxDischargeRate);
            dischargeAvailable += maxDischarge;
          });

          const actualDischarge = Math.min(deficit, dischargeAvailable);
          netSupply += actualDischarge;
          
          if (dischargeAvailable > 0) {
            const drainEach = (actualDischarge * deltaSec) / net.accumulators.length;
            net.accumulators.forEach(acc => {
              acc.storedEnergy = Math.max(0, acc.storedEnergy - drainEach);
            });
          }

          satisfaction = Math.min(1.0, netSupply / netDemand);
        }
      } else {
        satisfaction = 1.0;
      }

      net.supply = netSupply;
      net.demand = netDemand;
      net.satisfaction = satisfaction;
      net.storedEnergy = netStored;
      net.maxStorage = netCapacity;

      net.consumers.forEach(con => {
        con.powerSatisfied = satisfaction;
      });

      globalSupply += netSupply;
      globalDemand += netDemand;
    });

    this.totalProduction = globalSupply;
    this.totalDemand = globalDemand;
    this.globalSatisfaction = globalDemand > 0 ? Math.min(1.0, globalSupply / globalDemand) : 1.0;
  }
}
