import { TECH_MILESTONES } from '../core/Constants.js';
import { audioManager } from '../core/AudioManager.js';
import confetti from 'canvas-confetti';

export class MilestoneManager {
  constructor() {
    this.milestones = JSON.parse(JSON.stringify(TECH_MILESTONES));
    this.currentMilestoneIndex = 0;
    this.researchPoints = 0;
    
    this.progress = {};
    this.milestones.forEach((m, idx) => {
      this.progress[m.id] = {
        delivered: {},
        completed: idx === 0
      };
      m.deliveries.forEach(d => {
        this.progress[m.id].delivered[d.item] = 0;
      });
    });

    this.unlockedBuildings = new Set(this.milestones[0].unlockedBuildings);
    this.unlockedBuildings.add('wire_tool');
    this.unlockedRecipes = new Set(this.milestones[0].unlockedRecipes);
    this.unlockedItems = new Set(this.milestones[0].unlockedItems);

    this.currentMilestoneIndex = 1;
  }

  getCurrentMilestone() {
    if (this.currentMilestoneIndex < this.milestones.length) {
      return this.milestones[this.currentMilestoneIndex];
    }
    return this.milestones[this.milestones.length - 1];
  }

  getCurrentProgress() {
    const cur = this.getCurrentMilestone();
    return this.progress[cur.id] || null;
  }

  deliverItem(itemKey, count) {
    const cur = this.getCurrentMilestone();
    if (!cur) return;

    const prog = this.progress[cur.id];
    if (!prog || prog.completed) return;

    const req = cur.deliveries.find(d => d.item === itemKey);
    if (req) {
      prog.delivered[itemKey] = (prog.delivered[itemKey] || 0) + count;
      this.researchPoints += count * 5;
      
      this.checkCompletion(cur);
    } else {
      this.researchPoints += count * 1;
    }
  }

  checkCompletion(milestone) {
    const prog = this.progress[milestone.id];
    if (prog.completed) return;

    let allMet = true;
    for (const d of milestone.deliveries) {
      if ((prog.delivered[d.item] || 0) < d.target) {
        allMet = false;
        break;
      }
    }

    if (allMet) {
      this.completeMilestone(milestone);
    }
  }

  completeMilestone(milestone) {
    const prog = this.progress[milestone.id];
    prog.completed = true;

    milestone.unlockedBuildings.forEach(b => this.unlockedBuildings.add(b));
    milestone.unlockedRecipes.forEach(r => this.unlockedRecipes.add(r));
    milestone.unlockedItems.forEach(i => this.unlockedItems.add(i));

    audioManager.playMilestoneUnlock();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (this.currentMilestoneIndex < this.milestones.length - 1) {
      this.currentMilestoneIndex++;
    }

    window.dispatchEvent(new CustomEvent('milestone-unlocked', {
      detail: { milestone }
    }));
  }

  isBuildingUnlocked(buildingId) {
    return this.unlockedBuildings.has(buildingId);
  }

  isRecipeUnlocked(recipeId) {
    return this.unlockedRecipes.has(recipeId);
  }
}
