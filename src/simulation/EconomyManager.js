const ITEM_VALUES = {
  iron_ore: 4,
  copper_ore: 5,
  coal: 3,
  quartz: 8,
  titanium_ore: 16,
  iron_ingot: 12,
  copper_ingot: 15,
  silicon_wafer: 28,
  titanium_bar: 42,
  iron_plate: 28,
  gear: 36,
  copper_wire: 22,
  circuit_board: 80,
  microchip: 180,
  motor: 150,
  reinforced_plate: 120,
  energy_cell: 230,
  automation_core: 600
};

export class EconomyManager {
  constructor(balance = 1800) {
    this.balance = Math.max(0, Math.round(balance));
    this.totalEarned = 0;
    this.totalSpent = 0;
  }

  getBuildingCost(building) {
    if (!building) return 0;
    const materialCost = (building.cost || []).reduce((total, entry) => total + (ITEM_VALUES[entry.item] || 10) * entry.count, 0);
    return Math.max(10, Math.ceil(materialCost * 0.7));
  }

  canAfford(amount) {
    return this.balance >= amount;
  }

  spend(amount) {
    const charge = Math.max(0, Math.round(amount));
    if (!this.canAfford(charge)) return false;
    this.balance -= charge;
    this.totalSpent += charge;
    return true;
  }

  refundBuilding(building) {
    const refund = Math.floor(this.getBuildingCost(building.def || building) * 0.5);
    this.balance += refund;
    return refund;
  }

  sellItems(items, multiplier = 1) {
    let payout = 0;
    Object.entries(items || {}).forEach(([itemId, count]) => {
      payout += (ITEM_VALUES[itemId] || 0) * Math.floor(count) * multiplier;
    });
    payout = Math.max(0, Math.round(payout));
    this.balance += payout;
    this.totalEarned += payout;
    return payout;
  }

  getItemValue(itemId) {
    return ITEM_VALUES[itemId] || 0;
  }

  format(amount = this.balance) {
    return `$${Math.max(0, Math.round(amount)).toLocaleString()}`;
  }

  getSnapshot() {
    return {
      balance: this.balance,
      totalEarned: this.totalEarned,
      totalSpent: this.totalSpent
    };
  }

  restore(snapshot) {
    if (!snapshot) return;
    this.balance = Math.max(0, Math.round(snapshot.balance ?? this.balance));
    this.totalEarned = Math.max(0, Math.round(snapshot.totalEarned ?? 0));
    this.totalSpent = Math.max(0, Math.round(snapshot.totalSpent ?? 0));
  }
}
