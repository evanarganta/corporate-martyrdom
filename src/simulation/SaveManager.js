export class SaveManager {
  static SAVE_KEY = 'aetheria_factory_save';

  static save(grid, milestoneManager) {
    try {
      const data = {
        version: 1,
        timestamp: Date.now(),
        milestones: {
          currentIndex: milestoneManager.currentMilestoneIndex,
          researchPoints: milestoneManager.researchPoints,
          progress: milestoneManager.progress,
          unlockedBuildings: Array.from(milestoneManager.unlockedBuildings),
          unlockedRecipes: Array.from(milestoneManager.unlockedRecipes),
          unlockedItems: Array.from(milestoneManager.unlockedItems)
        },
        buildings: grid.buildings.map(b => ({
          type: b.type,
          x: b.x,
          y: b.y,
          direction: b.direction,
          recipeId: b.recipeId,
          inputs: b.inputs,
          outputs: b.outputs,
          conveyorItems: b.conveyorItems || [],
          craftProgress: b.craftProgress || 0
        })),
        wires: (grid.wires || []).map(w => ({
          fromId: w.fromId,
          toId: w.toId,
          x1: w.x1,
          y1: w.y1,
          x2: w.x2,
          y2: w.y2
        }))
      };

      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      return { success: true, message: 'Sector state saved to local storage.' };
    } catch (err) {
      console.error('Failed to save game:', err);
      return { success: false, message: 'Failed to save game: ' + err.message };
    }
  }

  static load(grid, milestoneManager) {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return { success: false, message: 'No save data found.' };

      const data = JSON.parse(raw);
      return this.applySaveData(data, grid, milestoneManager);
    } catch (err) {
      console.error('Failed to load game:', err);
      return { success: false, message: 'Corrupted save file: ' + err.message };
    }
  }

  static applySaveData(data, grid, milestoneManager) {
    while (grid.buildings.length > 0) {
      grid.removeBuilding(grid.buildings[0]);
    }
    grid.wires = [];

    if (data.milestones) {
      milestoneManager.currentMilestoneIndex = data.milestones.currentIndex || 1;
      milestoneManager.researchPoints = data.milestones.researchPoints || 0;
      milestoneManager.progress = data.milestones.progress || milestoneManager.progress;
      milestoneManager.unlockedBuildings = new Set(data.milestones.unlockedBuildings || []);
      milestoneManager.unlockedRecipes = new Set(data.milestones.unlockedRecipes || []);
      milestoneManager.unlockedItems = new Set(data.milestones.unlockedItems || []);
    }

    const idMap = new Map();
    if (data.buildings) {
      data.buildings.forEach(bData => {
        const inst = grid.placeBuilding(bData.type, bData.x, bData.y, bData.direction);
        if (inst) {
          inst.recipeId = bData.recipeId;
          inst.inputs = bData.inputs || {};
          inst.outputs = bData.outputs || {};
          inst.conveyorItems = bData.conveyorItems || [];
          inst.craftProgress = bData.craftProgress || 0;
          if (bData.id) idMap.set(bData.id, inst.id);
        }
      });
    }

    if (data.wires && Array.isArray(data.wires)) {
      data.wires.forEach(w => {
        const b1 = grid.buildings.find(b => b.x + b.width / 2 === w.x1 && b.y + b.height / 2 === w.y1) || grid.getBuildingById(w.fromId);
        const b2 = grid.buildings.find(b => b.x + b.width / 2 === w.x2 && b.y + b.height / 2 === w.y2) || grid.getBuildingById(w.toId);
        if (b1 && b2) {
          grid.addWire(b1, b2);
        }
      });
    }

    return { success: true, message: 'Sector restored successfully.' };
  }

  static exportJSON(grid, milestoneManager) {
    const res = this.save(grid, milestoneManager);
    if (!res.success) return;

    const raw = localStorage.getItem(this.SAVE_KEY);
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aetheria_factory_sector_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importJSON(file, grid, milestoneManager, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const res = this.applySaveData(data, grid, milestoneManager);
        if (callback) callback(res);
      } catch (err) {
        if (callback) callback({ success: false, message: 'Invalid JSON file: ' + err.message });
      }
    };
    reader.readAsText(file);
  }
}
