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
    const byId = new Map(buildings.map(building => [building.id, building]));
    const outgoing = new Map(buildings.map(building => [building.id, []]));
    (this.grid.wires || []).forEach(wire => {
      const from = byId.get(wire.fromId);
      const to = byId.get(wire.toId);
      if (from && to) outgoing.get(from.id).push(to);
    });

    buildings.forEach(building => {
      building.powerReceived = 0;
      building.powerSupplied = 0;
      building.powerSatisfied = building.def.powerDemand > 0 ? 0 : 1;
      if (building.type === 'accumulator' && building.storedEnergy === undefined) building.storedEnergy = 500;
    });

    const generators = buildings.filter(building => (building.def.powerOutput || 0) > 0);
    const consumers = buildings.filter(building => (building.def.powerDemand || 0) > 0);
    const accumulators = buildings.filter(building => building.type === 'accumulator');
    let totalGenerated = 0;

    // A branch asks for the unmet demand below it. Directed loops cannot create
    // power because an already visited node contributes no additional demand.
    const requestFor = (building, visited = new Set()) => {
      if (!building || visited.has(building.id)) return 0;
      const path = new Set(visited);
      path.add(building.id);
      let request = Math.max(0, (building.def.powerDemand || 0) - building.powerReceived);
      if (building.type === 'accumulator') {
        request += Math.max(0, Math.min(building.def.maxChargeRate || 120, (building.def.capacity || 0) - building.storedEnergy));
      }
      (outgoing.get(building.id) || []).forEach(child => { request += requestFor(child, path); });
      return request;
    };

    const distribute = (building, available, visited = new Set()) => {
      if (!building || available <= 0 || visited.has(building.id)) return 0;
      const path = new Set(visited);
      path.add(building.id);
      let remaining = available;

      const localDemand = building.def.powerDemand || 0;
      if (localDemand > 0) {
        const used = Math.min(remaining, Math.max(0, localDemand - building.powerReceived));
        building.powerReceived += used;
        remaining -= used;
      }

      if (building.type === 'accumulator' && remaining > 0) {
        const chargeLimit = (building.def.maxChargeRate || 120) * deltaSec;
        const charged = Math.min(remaining * deltaSec, chargeLimit, Math.max(0, building.def.capacity - building.storedEnergy));
        building.storedEnergy += charged;
        remaining -= charged / Math.max(deltaSec, 0.001);
      }

      let active = (outgoing.get(building.id) || [])
        .filter(child => !path.has(child.id))
        .map(child => ({ child, need: requestFor(child, path) }))
        .filter(branch => branch.need > 0.0001);
      let sent = 0;

      // Water-fill every output. A full branch leaves the pool, so the unused
      // share is divided across the branches that still need power.
      while (remaining > 0.0001 && active.length > 0) {
        const share = remaining / active.length;
        const next = [];
        let moved = 0;
        active.forEach(branch => {
          const used = distribute(branch.child, Math.min(share, branch.need), path);
          branch.need -= used;
          remaining -= used;
          moved += used;
          sent += used;
          if (branch.need > 0.0001) next.push(branch);
        });
        if (moved <= 0.0001) break;
        active = next;
      }

      building.powerSupplied += sent;
      return available - remaining;
    };

    generators.forEach(generator => {
      let output = generator.def.powerOutput || 0;
      if (generator.type === 'coal_generator') {
        const fuelRequired = (generator.def.fuelPerSec || 0.15) * deltaSec;
        const fuelAvailable = generator.inputs.coal || 0;
        output *= fuelRequired > 0 ? Math.min(1, fuelAvailable / fuelRequired) : 1;
        generator.inputs.coal = Math.max(0, fuelAvailable - fuelRequired);
      }
      totalGenerated += output;
      distribute(generator, output);
    });

    // Storage only supplies branches explicitly wired out of it; its input and
    // output cables are therefore separate, visible design decisions.
    accumulators.forEach(accumulator => {
      const downstreamDemand = (outgoing.get(accumulator.id) || [])
        .reduce((sum, child) => sum + requestFor(child, new Set([accumulator.id])), 0);
      const output = Math.min(
        accumulator.def.maxDischargeRate || 0,
        accumulator.storedEnergy / Math.max(deltaSec, 0.001),
        downstreamDemand
      );
      if (output > 0) {
        const used = distribute(accumulator, output);
        accumulator.storedEnergy = Math.max(0, accumulator.storedEnergy - used * deltaSec);
      }
    });

    let totalDemand = 0;
    let totalDelivered = 0;
    consumers.forEach(consumer => {
      const demand = consumer.def.powerDemand || 0;
      totalDemand += demand;
      totalDelivered += Math.min(demand, consumer.powerReceived);
      consumer.powerSatisfied = demand > 0 ? Math.min(1, consumer.powerReceived / demand) : 1;
    });

    this.totalProduction = totalGenerated;
    this.totalDemand = totalDemand;
    this.globalSatisfaction = totalDemand > 0 ? totalDelivered / totalDemand : 1;
    this.networks = [{ buildings, generators, consumers, accumulators, supply: totalGenerated, demand: totalDemand, satisfaction: this.globalSatisfaction }];
  }
}
