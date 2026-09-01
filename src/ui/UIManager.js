import { BUILDINGS, RECIPES, ITEMS, TECH_MILESTONES } from '../core/Constants.js';
import { audioManager } from '../core/AudioManager.js';
import { SaveManager } from '../simulation/SaveManager.js';

export class UIManager {
  constructor(scene, grid, powerGrid, logistics, factory, milestoneManager) {
    this.scene = scene;
    this.grid = grid;
    this.powerGrid = powerGrid;
    this.logistics = logistics;
    this.factory = factory;
    this.milestoneManager = milestoneManager;

    this.currentCategory = 'logistics';
    this.inspectedBuilding = null;

    this.initDOM();
    this.bindEvents();
    this.renderHotbar();
    this.updateMilestoneTracker();
  }

  initDOM() {
    // Header Stats
    this.statPowerVal = document.getElementById('stat-power-val');
    this.powerFillMini = document.getElementById('power-fill-mini');
    this.statResearchVal = document.getElementById('stat-research-val');

    // Placement Banner
    this.placementBanner = document.getElementById('placement-guide-banner');
    this.placementActiveName = document.getElementById('placement-active-name');
    this.placementConfirmHint = document.getElementById('placement-confirm-hint');
    this.placementRotateHint = document.getElementById('placement-rotate-hint');

    // Hotbar
    this.hotbarContainer = document.getElementById('hotbar-items-container');
    this.catBtns = document.querySelectorAll('.cat-btn');

    // Inspector
    this.inspectorPanel = document.getElementById('inspector-panel');
    this.inspectorTitle = document.getElementById('inspector-title');
    this.inspectorStatus = document.getElementById('inspector-status');
    this.inspectorEfficiencyVal = document.getElementById('inspector-efficiency-val');
    this.inspectorEfficiencyBar = document.getElementById('inspector-efficiency-bar');
    this.inspectorPowerVal = document.getElementById('inspector-power-val');
    this.inspectorGridLabel = document.getElementById('inspector-grid-label');
    this.inspectorGridMetricLabel = document.getElementById('inspector-grid-metric-label');
    this.inspectorPowerLabel = document.getElementById('inspector-power-label');
    this.inspectorPowerMetricLabel = document.getElementById('inspector-power-metric-label');
    this.inspectorRecipeSection = document.getElementById('inspector-recipe-section');
    this.recipeName = document.getElementById('recipe-name');
    this.recipeSelectDropdown = document.getElementById('recipe-select-dropdown');
    this.inspectorInputs = document.getElementById('inspector-inputs');
    this.inspectorOutputs = document.getElementById('inspector-outputs');
    this.inspectorInputLabel = document.getElementById('inspector-input-label');
    this.inspectorOutputLabel = document.getElementById('inspector-output-label');
    this.inspectorCraftBar = document.getElementById('inspector-craft-bar');
    this.inspectorCycleTime = document.getElementById('inspector-cycle-time');
    this.inspectorCycleRing = document.getElementById('inspector-cycle-ring');

    // Milestone Tracker
    this.trackerTierBadge = document.getElementById('tracker-tier-badge');
    this.trackerTitle = document.getElementById('tracker-title');
    this.trackerDeliveries = document.getElementById('tracker-deliveries');
    this.trackerProgressFill = document.getElementById('tracker-progress-fill');
    this.trackerProgressText = document.getElementById('tracker-progress-text');

    // Modals
    this.modalMilestones = document.getElementById('modal-milestones');
    this.modalStats = document.getElementById('modal-stats');
    this.modalBlueprints = document.getElementById('modal-blueprints');
    this.modalHelp = document.getElementById('modal-help');
    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Category Tabs (Z, X, C, V, B, and Demolish N)
    this.catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        const tool = btn.dataset.tool;

        this.catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tool === 'demolish') {
          this.scene.setTool('demolish');
        } else if (cat) {
          this.currentCategory = cat;
          this.scene.setTool(null);
          this.renderHotbar();
          audioManager.playUiClick();
        }
      });
    });

    // Speed Controls
    const speedMap = {
      'btn-speed-pause': 0.0,
      'btn-speed-1x': 1.0,
      'btn-speed-2x': 2.0,
      'btn-speed-5x': 5.0
    };
    Object.keys(speedMap).forEach(btnId => {
      document.getElementById(btnId).addEventListener('click', (e) => {
        document.querySelectorAll('.speed-controls .btn-icon').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.scene.gameSpeed = speedMap[btnId];
        audioManager.playUiClick();
      });
    });

    // Top Modal Toggles
    document.getElementById('btn-toggle-milestones').addEventListener('click', () => this.openModal(this.modalMilestones, () => this.renderTechTree(0)));
    document.getElementById('btn-open-launchpad').addEventListener('click', () => this.openModal(this.modalMilestones, () => this.renderTechTree(0)));
    document.getElementById('btn-toggle-stats').addEventListener('click', () => this.openModal(this.modalStats, () => this.renderAnalytics()));
    document.getElementById('btn-toggle-blueprints').addEventListener('click', () => this.openModal(this.modalBlueprints));
    document.getElementById('btn-help').addEventListener('click', () => this.openModal(this.modalHelp));

    // Audio Toggle
    document.getElementById('btn-toggle-audio').addEventListener('click', (e) => {
      const isEnabled = audioManager.toggleSound();
      e.target.textContent = isEnabled ? 'SND' : 'MUT';
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    // Close Modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(mb => {
      mb.addEventListener('click', (e) => {
        if (e.target === mb) this.closeAllModals();
      });
    });

    // Inspector Close
    document.getElementById('btn-close-inspector').addEventListener('click', () => {
      this.inspectBuilding(null);
    });

    // Submit items to Phase Objectives (Delivery Station only)
    document.getElementById('btn-inspector-submit').addEventListener('click', () => {
      if (!this.inspectedBuilding || this.inspectedBuilding.type !== 'launchpad') return;
      const b = this.inspectedBuilding;
      let deliveredTotal = 0;
      const curMilestone = this.milestoneManager.getCurrentMilestone();
      if (!curMilestone) return;

      const eligibleItems = curMilestone.deliveries.map(d => d.item);

      // Check inputs of the delivery station
      Object.keys(b.inputs).forEach(itemKey => {
        if (eligibleItems.includes(itemKey) && b.inputs[itemKey] > 0) {
          const count = Math.floor(b.inputs[itemKey]);
          if (count > 0) {
            this.milestoneManager.deliverItem(itemKey, count);
            deliveredTotal += count;
            b.inputs[itemKey] = 0;
          }
        }
      });

      if (deliveredTotal > 0) {
        audioManager.playUiClick();
        this.updateInspectorContent();
        this.updateMilestoneTracker();
        this.showToast(`Delivered +${deliveredTotal} items to Phase Objective!`, 'success');
      } else {
        this.showToast('No items in Delivery Station matching active objective.', 'info');
      }
    });

    // Inspector Flush & Demolish
    document.getElementById('btn-inspector-flush').addEventListener('click', () => {
      if (this.inspectedBuilding) {
        this.showConfirmDialog(
          'Flush Machine Inventory',
          'Empty all input and output buffers for this facility?',
          () => {
            if (this.inspectedBuilding) {
              this.inspectedBuilding.inputs = {};
              this.inspectedBuilding.outputs = {};
              this.updateInspectorContent();
              this.showToast('Buffers cleared.', 'warn');
            }
          }
        );
      }
    });

    // Single Dismantle with Confirmation
    document.getElementById('btn-inspector-demolish').addEventListener('click', () => {
      if (this.inspectedBuilding) {
        const b = this.inspectedBuilding;
        this.showConfirmDialog(
          `Dismantle ${b.def.name}`,
          'Dismantle this facility? All contained materials will be retrieved.',
          () => {
            this.scene.demolishAt(b.x, b.y);
          }
        );
      }
    });

    // Bulk Dismantle Connected Line with Confirmation
    const btnLineDemolish = document.getElementById('btn-inspector-demolish-line');
    if (btnLineDemolish) {
      btnLineDemolish.addEventListener('click', () => {
        if (this.inspectedBuilding && this.inspectedBuilding.type.startsWith('conveyor')) {
          const b = this.inspectedBuilding;
          this.showConfirmDialog(
            'Bulk Remove Conveyor Line',
            'Demolish the entire continuous connected conveyor belt network?',
            () => {
              this.scene.demolishConnectedLine(b);
              this.showToast('Conveyor line dismantled.', 'warn');
            }
          );
        }
      });
    }

    // Confirmation Modal Buttons
    const modalConfirm = document.getElementById('modal-confirm');
    const btnConfirmOk = document.getElementById('btn-confirm-ok');
    const btnConfirmCancel = document.getElementById('btn-confirm-cancel');

    if (btnConfirmOk && btnConfirmCancel) {
      btnConfirmCancel.addEventListener('click', () => {
        if (modalConfirm) modalConfirm.classList.add('hidden');
        this.pendingConfirmCallback = null;
      });

      btnConfirmOk.addEventListener('click', () => {
        if (modalConfirm) modalConfirm.classList.add('hidden');
        if (this.pendingConfirmCallback) {
          this.pendingConfirmCallback();
          this.pendingConfirmCallback = null;
        }
      });
    }

    // Inspector Recipe Dropdown Toggle
    document.getElementById('btn-change-recipe').addEventListener('click', () => {
      this.recipeSelectDropdown.classList.toggle('hidden');
    });

    // Save & Load Handlers
    document.getElementById('btn-save-game').addEventListener('click', () => {
      const res = SaveManager.save(this.grid, this.milestoneManager);
      this.showToast(res.message, res.success ? 'success' : 'error');
    });

    document.getElementById('btn-load-game').addEventListener('click', () => {
      const res = SaveManager.load(this.grid, this.milestoneManager);
      this.showToast(res.message, res.success ? 'success' : 'error');
      this.renderHotbar();
      this.updateMilestoneTracker();
    });

    document.getElementById('btn-export-save').addEventListener('click', () => {
      SaveManager.exportJSON(this.grid, this.milestoneManager);
    });

    const fileInput = document.getElementById('file-import-save');
    document.getElementById('btn-import-save').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        SaveManager.importJSON(e.target.files[0], this.grid, this.milestoneManager, (res) => {
          this.showToast(res.message, res.success ? 'success' : 'error');
          this.renderHotbar();
          this.updateMilestoneTracker();
        });
      }
    });

    document.getElementById('btn-reset-world').addEventListener('click', () => {
      this.showConfirmDialog(
        'Reset Sector Map',
        'Reset factory sector to clean map? All constructed structures will be permanently cleared.',
        () => {
          localStorage.removeItem(SaveManager.SAVE_KEY);
          window.location.reload();
        }
      );
    });

    // Milestone Unlock Event Listener
    window.addEventListener('milestone-unlocked', (e) => {
      const m = e.detail.milestone;
      this.showToast(`Milestone Unlocked: ${m.title}`, 'success');
      this.renderHotbar();
      this.updateMilestoneTracker();
    });
  }

  showConfirmDialog(title, message, onConfirm) {
    const modalConfirm = document.getElementById('modal-confirm');
    const titleElem = document.getElementById('confirm-title');
    const msgElem = document.getElementById('confirm-msg');

    if (modalConfirm && titleElem && msgElem) {
      titleElem.textContent = title;
      msgElem.textContent = message;
      this.pendingConfirmCallback = onConfirm;
      modalConfirm.classList.remove('hidden');
      audioManager.playUiClick();
    } else if (onConfirm) {
      if (confirm(`${title}\n${message}`)) {
        onConfirm();
      }
    }
  }

  hasOpenConfirmModal() {
    const modalConfirm = document.getElementById('modal-confirm');
    return modalConfirm && !modalConfirm.classList.contains('hidden');
  }

  confirmPendingAction() {
    const modalConfirm = document.getElementById('modal-confirm');
    if (modalConfirm) modalConfirm.classList.add('hidden');
    if (this.pendingConfirmCallback) {
      const cb = this.pendingConfirmCallback;
      this.pendingConfirmCallback = null;
      cb();
    }
  }

  cancelPendingAction() {
    const modalConfirm = document.getElementById('modal-confirm');
    if (modalConfirm) modalConfirm.classList.add('hidden');
    this.pendingConfirmCallback = null;
  }

  switchCategory(catName) {
    this.currentCategory = catName;
    this.catBtns.forEach(b => {
      if (b.dataset.category === catName) b.classList.add('active');
      else b.classList.remove('active');
    });
    this.renderHotbar();
    audioManager.playUiClick();
  }

  selectHotbarSlotByIndex(index) {
    const buildingsInCat = this.getBuildingsInCurrentCategory();
    if (index >= 0 && index < buildingsInCat.length) {
      const b = buildingsInCat[index];
      if (this.milestoneManager.isBuildingUnlocked(b.id)) {
        if (this.scene.activeTool === b.id) {
          // Pressing the same number again cancels the selected tool
          this.scene.setTool(null);
        } else {
          // Pressing another number equips that component
          this.scene.setTool(b.id);
        }
        this.renderHotbar();
        audioManager.playUiClick();
      }
    }
  }

  toggleModal(modalKey) {
    const modalMap = {
      milestones: { elem: this.modalMilestones, cb: () => this.renderTechTree(0) },
      stats: { elem: this.modalStats, cb: () => this.renderAnalytics() },
      blueprints: { elem: this.modalBlueprints, cb: null },
      help: { elem: this.modalHelp, cb: null }
    };

    const target = modalMap[modalKey];
    if (!target) return;

    if (!target.elem.classList.contains('hidden')) {
      target.elem.classList.add('hidden');
    } else {
      this.openModal(target.elem, target.cb);
    }
  }

  renderHotbar() {
    this.hotbarContainer.innerHTML = '';
    const buildingsInCat = this.getBuildingsInCurrentCategory();

    buildingsInCat.forEach((b, idx) => {
      const isUnlocked = this.milestoneManager.isBuildingUnlocked(b.id);
      const slot = document.createElement('div');
      slot.className = `hotbar-slot ${isUnlocked ? '' : 'locked'} ${this.scene.activeTool === b.id ? 'active' : ''}`;
      slot.title = `${b.name} [${idx + 1}]\nPower: ${b.powerDemand > 0 ? b.powerDemand + ' kW' : (b.powerOutput > 0 ? '+' + b.powerOutput + ' kW' : 'Passive')}`;

      slot.innerHTML = `
        <div class="slot-icon-image">${b.iconSvg}</div>
        <div class="slot-text-wrap">
          <span class="slot-key-tag">${idx + 1}</span>
          <span class="slot-name-full">${b.name}</span>
        </div>
      `;

      if (isUnlocked) {
        slot.addEventListener('click', () => {
          if (this.scene.activeTool === b.id) {
            this.scene.setTool(null);
          } else {
            this.scene.setTool(b.id);
          }
          this.renderHotbar();
          audioManager.playUiClick();
        });
      }

      this.hotbarContainer.appendChild(slot);
    });
  }

  getBuildingsInCurrentCategory() {
    const buildings = Object.values(BUILDINGS).filter(b => b.category === this.currentCategory);
    if (this.currentCategory !== 'power') return buildings;

    const powerOrder = ['wire_tool', 'power_pole', 'solar_panel', 'coal_generator', 'accumulator'];
    return buildings.sort((a, b) => powerOrder.indexOf(a.id) - powerOrder.indexOf(b.id));
  }

  updateToolPill(toolName) {
    if (!toolName) {
      if (this.placementBanner) this.placementBanner.classList.add('hidden');
      this.catBtns.forEach(b => {
        if (b.dataset.tool === 'demolish') b.classList.remove('active');
        else if (b.dataset.category === this.currentCategory) b.classList.add('active');
      });
      this.renderHotbar();
      return;
    }

    if (this.placementBanner && this.placementActiveName) {
      this.placementBanner.classList.remove('hidden');
      if (toolName === 'demolish') {
        this.placementActiveName.textContent = 'Demolish Mode';
        if (this.placementConfirmHint) this.placementConfirmHint.innerHTML = '<kbd>Click</kbd> / <kbd>E</kbd> Single • <kbd>Shift+Click</kbd> Line • <kbd>Drag</kbd> Sweep';
        if (this.placementRotateHint) this.placementRotateHint.classList.add('hidden');
        this.catBtns.forEach(b => {
          if (b.dataset.tool === 'demolish') b.classList.add('active');
          else b.classList.remove('active');
        });
      } else {
        const b = BUILDINGS[toolName];
        this.placementActiveName.textContent = b ? b.name : toolName;
        if (this.placementConfirmHint) this.placementConfirmHint.innerHTML = '<kbd>E</kbd> / <kbd>Click</kbd> Build';
        if (this.placementRotateHint) {
          if (b && b.directional !== false) {
            this.placementRotateHint.classList.remove('hidden');
          } else {
            this.placementRotateHint.classList.add('hidden');
          }
        }
        this.catBtns.forEach(btn => {
          if (btn.dataset.tool === 'demolish') btn.classList.remove('active');
          else if (btn.dataset.category === this.currentCategory) btn.classList.add('active');
        });
      }
    }

    this.renderHotbar();
  }

  updateHUD(hoverTile) {
    // Power Stats
    const supply = Math.round(this.powerGrid.totalProduction);
    const demand = Math.round(this.powerGrid.totalDemand);
    if (this.statPowerVal) {
      this.statPowerVal.textContent = `${supply} / ${demand} kW`;
    }
    const sat = Math.round(this.powerGrid.globalSatisfaction * 100);
    if (this.powerFillMini) {
      this.powerFillMini.style.width = `${sat}%`;
      this.powerFillMini.style.background = sat < 80 ? '#c0392b' : '#f1c40f';
    }

    // Research Points
    if (this.statResearchVal) {
      this.statResearchVal.textContent = `${this.milestoneManager.researchPoints}`;
    }

    // Inspector update if open
    if (this.inspectedBuilding) {
      this.updateInspectorContent();
    }
  }

  updateMilestoneTracker() {
    const cur = this.milestoneManager.getCurrentMilestone();
    if (!cur) return;

    const prog = this.milestoneManager.getCurrentProgress();
    this.trackerTierBadge.textContent = `PHASE ${cur.tier}`;
    this.trackerTitle.textContent = cur.title;

    this.trackerDeliveries.innerHTML = '';
    let totalNeeded = 0;
    let totalDelivered = 0;

    cur.deliveries.forEach(d => {
      const itemDef = ITEMS[d.item] || { name: d.item, symbol: d.item, iconSvg: '' };
      const delCount = prog ? (prog.delivered[d.item] || 0) : 0;
      totalNeeded += d.target;
      totalDelivered += Math.min(d.target, delCount);

      const row = document.createElement('div');
      row.className = 'delivery-row';
      row.innerHTML = `
        <div class="delivery-row-left">
          <div class="mini-icon-box">${itemDef.iconSvg}</div>
          <span>${itemDef.name}</span>
        </div>
        <span class="${delCount >= d.target ? 'text-green' : 'text-amber'}">${delCount} / ${d.target}</span>
      `;
      this.trackerDeliveries.appendChild(row);
    });

    const pct = totalNeeded > 0 ? Math.min(100, Math.round((totalDelivered / totalNeeded) * 100)) : 100;
    this.trackerProgressFill.style.width = `${pct}%`;
    this.trackerProgressText.textContent = `${totalDelivered} / ${totalNeeded}`;
  }

  inspectBuilding(building) {
    this.inspectedBuilding = building;
    if (!building) {
      this.inspectorPanel.classList.add('hidden');
      return;
    }

    this.inspectorPanel.classList.remove('hidden');
    this.inspectorPanel.classList.remove('delivery-station-inspector');
    const isProcessor = ['smelter_mk1', 'smelter_mk2', 'assembler_mk1', 'assembler_mk2'].includes(building.type);
    const hasCycleTelemetry = isProcessor || building.type === 'burner_drill';
    const powerRole = building.def.powerOutput > 0
      ? 'producer'
      : building.type === 'accumulator'
        ? 'storage'
        : ['power_pole', 'wire_tool'].includes(building.type)
          ? 'distribution'
          : building.def.powerDemand > 0
            ? 'consumer'
            : 'none';
    const hasPowerTelemetry = powerRole !== 'none';
    const usesSingleBuffer = ['storage_chest', 'launchpad', 'coal_generator'].includes(building.type);
    this.inspectorPanel.classList.toggle('inspector-no-power-telemetry', !hasPowerTelemetry);
    this.inspectorPanel.classList.toggle('inspector-no-cycle', !hasCycleTelemetry);
    this.inspectorPanel.classList.toggle('inspector-single-buffer', usesSingleBuffer);
    this.inspectorPanel.classList.toggle('inspector-electrical', ['producer', 'storage', 'distribution'].includes(powerRole));
    this.inspectorPanel.classList.toggle('inspector-power-producer', powerRole === 'producer');
    this.inspectorInputLabel.textContent = building.type === 'launchpad'
      ? 'DELIVERY INVENTORY'
      : building.type === 'storage_chest'
        ? 'STORED ITEMS'
        : building.type === 'coal_generator'
          ? 'FUEL BUFFER'
          : 'INPUT BUFFER';
    this.inspectorOutputLabel.textContent = 'OUTPUT BUFFER';
    this.inspectorTitle.textContent = building.def.name;
    this.recipeSelectDropdown.classList.add('hidden');

    // Toggle bulk remove line button for conveyors
    const btnLineDemolish = document.getElementById('btn-inspector-demolish-line');
    if (btnLineDemolish) {
      if (building.type.startsWith('conveyor')) {
        btnLineDemolish.classList.remove('hidden');
      } else {
        btnLineDemolish.classList.add('hidden');
      }
    }

    // Toggle dedicated Delivery Station Deliver to Hub row
    const siloActionRow = document.getElementById('inspector-silo-action-row');
    if (siloActionRow) {
      if (building.type === 'launchpad') {
        siloActionRow.classList.remove('hidden');
      } else {
        siloActionRow.classList.add('hidden');
      }
    }

    // Recipes dropdown setup
    if (isProcessor) {
      this.inspectorRecipeSection.classList.remove('hidden');
      const validRecipes = RECIPES.filter(r => r.machineType.includes(building.type) && this.milestoneManager.isRecipeUnlocked(r.id));
      
      this.recipeSelectDropdown.innerHTML = '';
      validRecipes.forEach(rec => {
        const opt = document.createElement('button');
        opt.className = 'recipe-opt-btn';
        opt.innerHTML = `
          <div class="opt-left">
            <div class="mini-icon-box">${rec.iconSvg}</div>
            <span>${rec.name}</span>
          </div>
          <small>${rec.duration}s</small>
        `;
        opt.addEventListener('click', () => {
          building.recipeId = rec.id;
          building.craftProgress = 0.0;
          this.recipeSelectDropdown.classList.add('hidden');
          this.updateInspectorContent();
          audioManager.playUiClick();
        });
        this.recipeSelectDropdown.appendChild(opt);
      });
    } else {
      this.inspectorRecipeSection.classList.add('hidden');
    }

    this.updateInspectorContent();
  }

  updateInspectorContent() {
    const b = this.inspectedBuilding;
    if (!b) return;

    // Power telemetry adapts to the facility's electrical role.
    const powerPct = Math.round(b.powerSatisfied * 100);
    const powerRole = b.def.powerOutput > 0
      ? 'producer'
      : b.type === 'accumulator'
        ? 'storage'
        : ['power_pole', 'wire_tool'].includes(b.type)
          ? 'distribution'
          : 'consumer';

    if (powerRole === 'producer') {
      this.inspectorGridLabel.textContent = 'GRID CONNECTION';
      this.inspectorGridMetricLabel.textContent = 'Network';
      this.inspectorEfficiencyVal.textContent = 'ONLINE';
      this.inspectorEfficiencyBar.style.width = '100%';
      this.inspectorPowerLabel.textContent = 'POWER PRODUCTION';
      this.inspectorPowerMetricLabel.textContent = 'Supply';
      this.inspectorPowerVal.textContent = `+${b.def.powerOutput} kW`;
    } else if (powerRole === 'storage') {
      const storedEnergy = Math.round(b.storedEnergy || 0);
      const capacity = b.def.capacity || 0;
      const chargePct = capacity > 0 ? Math.round((storedEnergy / capacity) * 100) : 0;
      this.inspectorGridLabel.textContent = 'ENERGY STORAGE';
      this.inspectorGridMetricLabel.textContent = 'Charge';
      this.inspectorEfficiencyVal.textContent = `${chargePct}%`;
      this.inspectorEfficiencyBar.style.width = `${chargePct}%`;
      this.inspectorPowerLabel.textContent = 'BATTERY RESERVE';
      this.inspectorPowerMetricLabel.textContent = 'Stored';
      this.inspectorPowerVal.textContent = `${storedEnergy} / ${capacity} kJ`;
    } else if (powerRole === 'distribution') {
      const reach = b.def.supplyRadius || b.def.maxReach || b.def.wireReach || 0;
      this.inspectorGridLabel.textContent = 'GRID RELAY';
      this.inspectorGridMetricLabel.textContent = 'Link';
      this.inspectorEfficiencyVal.textContent = 'READY';
      this.inspectorEfficiencyBar.style.width = '100%';
      this.inspectorPowerLabel.textContent = 'NETWORK REACH';
      this.inspectorPowerMetricLabel.textContent = 'Range';
      this.inspectorPowerVal.textContent = `${reach} tiles`;
    } else {
      this.inspectorGridLabel.textContent = 'GRID SATISFACTION';
      this.inspectorGridMetricLabel.textContent = 'Grid';
      this.inspectorEfficiencyVal.textContent = `${powerPct}%`;
      this.inspectorEfficiencyBar.style.width = `${powerPct}%`;
      this.inspectorPowerLabel.textContent = 'POWER DEMAND';
      this.inspectorPowerMetricLabel.textContent = 'Draw';
      this.inspectorPowerVal.textContent = `${b.def.powerDemand} kW`;
    }

    if (b.def.powerDemand > 0 && b.powerSatisfied < 0.1) {
      this.inspectorStatus.textContent = 'NO POWER';
      this.inspectorStatus.className = 'status-badge status-no-power';
    } else if (b.type === 'coal_generator') {
      const hasFuel = (b.inputs['coal'] || 0) > 0;
      this.inspectorStatus.textContent = hasFuel ? 'ACTIVE' : 'NO FUEL';
      this.inspectorStatus.className = `status-badge ${hasFuel ? 'status-active' : 'status-no-power'}`;
    } else if (powerRole === 'producer') {
      this.inspectorStatus.textContent = 'ONLINE';
      this.inspectorStatus.className = 'status-badge status-active';
    } else if (powerRole === 'storage') {
      this.inspectorStatus.textContent = 'STANDBY';
      this.inspectorStatus.className = 'status-badge status-idle';
    } else if (powerRole === 'distribution') {
      this.inspectorStatus.textContent = 'RELAY';
      this.inspectorStatus.className = 'status-badge status-active';
    } else if (b.craftProgress > 0.05) {
      this.inspectorStatus.textContent = 'ACTIVE';
      this.inspectorStatus.className = 'status-badge status-active';
    } else {
      this.inspectorStatus.textContent = 'IDLE';
      this.inspectorStatus.className = 'status-badge status-idle';
    }

    // Recipe Display
    if (b.recipeId) {
      const rec = RECIPES.find(r => r.id === b.recipeId);
      this.recipeName.textContent = rec ? rec.name : b.recipeId;
      this.inspectorCycleTime.textContent = rec ? `${rec.duration}s` : '1.0s';
    }

    // Input Buffers
    this.inspectorInputs.innerHTML = '';
    Object.keys(b.inputs).forEach(itemKey => {
      const count = Math.floor(b.inputs[itemKey] || 0);
      if (count > 0) {
        const itemDef = ITEMS[itemKey] || { name: itemKey, symbol: itemKey, iconSvg: '' };
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.title = `${itemDef.name}: ${count}`;
        slot.innerHTML = `
          <div class="inv-icon-svg">${itemDef.iconSvg}</div>
          <span class="inv-count">${count}</span>
        `;
        this.inspectorInputs.appendChild(slot);
      }
    });
    if (this.inspectorInputs.children.length === 0) {
      this.inspectorInputs.innerHTML = '<small class="text-dim">Empty</small>';
    }

    // Craft Progress
    const craftPct = Math.min(100, Math.round(b.craftProgress * 100));
    this.inspectorCraftBar.style.width = `${craftPct}%`;
    if (this.inspectorCycleRing) {
      this.inspectorCycleRing.style.setProperty('--cycle-progress', craftPct);
    }

    // Output Buffers
    this.inspectorOutputs.innerHTML = '';
    Object.keys(b.outputs).forEach(itemKey => {
      const count = Math.floor(b.outputs[itemKey] || 0);
      if (count > 0) {
        const itemDef = ITEMS[itemKey] || { name: itemKey, symbol: itemKey, iconSvg: '' };
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.title = `${itemDef.name}: ${count}`;
        slot.innerHTML = `
          <div class="inv-icon-svg">${itemDef.iconSvg}</div>
          <span class="inv-count">${count}</span>
        `;
        this.inspectorOutputs.appendChild(slot);
      }
    });
    if (this.inspectorOutputs.children.length === 0) {
      this.inspectorOutputs.innerHTML = '<small class="text-dim">Empty</small>';
    }
  }

  renderTechTree(activeTier = 0) {
    const container = document.getElementById('tech-nodes-container');
    const tabsContainer = document.getElementById('tech-tier-tabs');
    container.innerHTML = '';

    // Setup Tier Tabs
    tabsContainer.innerHTML = '';
    TECH_MILESTONES.forEach(m => {
      const btn = document.createElement('button');
      btn.className = `tier-tab-btn ${m.tier === activeTier ? 'active' : ''}`;
      btn.textContent = `Phase ${m.tier}: ${m.title}`;
      btn.addEventListener('click', () => {
        this.renderTechTree(m.tier);
        audioManager.playUiClick();
      });
      tabsContainer.appendChild(btn);
    });

    // Render Milestone Cards for this Tier
    const milestonesInTier = TECH_MILESTONES.filter(m => m.tier === activeTier);

    milestonesInTier.forEach(m => {
      const prog = this.milestoneManager.progress[m.id];
      const isCompleted = prog ? prog.completed : false;
      const isAvailable = this.milestoneManager.getCurrentMilestone().id === m.id;

      const card = document.createElement('div');
      card.className = `tech-card ${isCompleted ? 'unlocked' : (isAvailable ? 'available' : 'locked')}`;

      // Build unlocks tags
      let unlocksHTML = '';
      m.unlockedBuildings.forEach(bId => {
        const b = BUILDINGS[bId];
        if (b) {
          unlocksHTML += `<span class="unlock-pill"><div class="mini-icon-box">${b.iconSvg}</div> ${b.name}</span>`;
        }
      });
      m.unlockedRecipes.forEach(rId => {
        const r = RECIPES.find(rec => rec.id === rId);
        if (r) {
          unlocksHTML += `<span class="unlock-pill"><div class="mini-icon-box">${r.iconSvg}</div> ${r.name}</span>`;
        }
      });

      // Build deliveries list
      let reqHTML = '';
      m.deliveries.forEach(d => {
        const itemDef = ITEMS[d.item] || { name: d.item, symbol: d.item, iconSvg: '' };
        const delCount = prog ? (prog.delivered[d.item] || 0) : 0;
        reqHTML += `
          <div class="delivery-row">
            <div class="delivery-row-left">
              <div class="mini-icon-box">${itemDef.iconSvg}</div>
              <span>${itemDef.name}</span>
            </div>
            <strong>${delCount} / ${d.target}</strong>
          </div>
        `;
      });

      card.innerHTML = `
        <div>
          <div class="tech-card-header">
            <div class="tech-title">${m.title}</div>
            <small class="${isCompleted ? 'text-green' : (isAvailable ? 'text-amber' : 'text-dim')}">${isCompleted ? 'COMPLETED' : (isAvailable ? 'ACTIVE' : 'LOCKED')}</small>
          </div>
          <p class="tech-desc">${m.description}</p>
          <div class="section-label">UNLOCKED BLUEPRINTS</div>
          <div class="tech-unlocks-preview">${unlocksHTML}</div>
        </div>

        <div>
          <div class="section-label">DELIVERY QUOTA</div>
          <div class="delivery-items-list">${reqHTML}</div>
          <div class="tech-cost-row">
            <span>Research: <strong>${m.costRP}</strong></span>
            ${isAvailable && !isCompleted ? `<button id="btn-manual-turnin-${m.id}" class="btn-sm btn-accent">Submit from Hub</button>` : ''}
          </div>
        </div>
      `;

      container.appendChild(card);

      const turninBtn = card.querySelector(`#btn-manual-turnin-${m.id}`);
      if (turninBtn) {
        turninBtn.addEventListener('click', () => {
          // Strictly pull required items from Delivery Station (launchpad) input buffers only
          const launchpads = this.grid.buildings.filter(b => b.type === 'launchpad');
          let totalDelivered = 0;
          
          m.deliveries.forEach(d => {
            const currentProg = this.milestoneManager.getCurrentProgress();
            const alreadyDelivered = currentProg ? (currentProg.delivered[d.item] || 0) : 0;
            let stillNeeded = Math.max(0, d.target - alreadyDelivered);
            if (stillNeeded <= 0) return;

            for (const lp of launchpads) {
              const available = Math.floor(lp.inputs[d.item] || 0);
              if (available > 0) {
                const toTake = Math.min(stillNeeded, available);
                lp.inputs[d.item] -= toTake;
                this.milestoneManager.deliverItem(d.item, toTake);
                stillNeeded -= toTake;
                totalDelivered += toTake;
                if (stillNeeded <= 0) break;
              }
            }
          });

          if (totalDelivered > 0) {
            audioManager.playUiClick();
            this.renderTechTree(activeTier);
            this.updateMilestoneTracker();
            this.showToast(`Delivered +${totalDelivered} items from Hub to Phase Objective!`, 'success');
          } else {
            this.showToast('No matching items currently stored in the Delivery Station Hub.', 'warn');
          }
        });
      }
    });
  }

  renderAnalytics() {
    const powerPct = document.getElementById('analytics-power-pct');
    const powerSub = document.getElementById('analytics-power-sub');
    const powerBar = document.getElementById('analytics-power-bar');
    const oreRates = document.getElementById('analytics-ore-rates');
    const ratesTbody = document.getElementById('analytics-rates-tbody');

    const supply = Math.round(this.powerGrid.totalProduction);
    const demand = Math.round(this.powerGrid.totalDemand);
    const sat = Math.round(this.powerGrid.globalSatisfaction * 100);

    powerPct.textContent = `${sat}%`;
    powerSub.textContent = `Supply: ${supply} kW / Demand: ${demand} kW`;
    powerBar.style.width = `${sat}%`;

    // Render Ore extraction stats
    oreRates.innerHTML = '';
    ['iron_ore', 'copper_ore', 'coal', 'quartz', 'titanium_ore'].forEach(oreKey => {
      const itemDef = ITEMS[oreKey];
      const rateObj = this.factory.getProductionRates()[oreKey] || { lastProduced: 0 };
      const div = document.createElement('div');
      div.className = 'metric-row';
      div.innerHTML = `
        <div class="delivery-row-left">
          <div class="mini-icon-box">${itemDef.iconSvg}</div>
          <span>${itemDef.name}</span>
        </div>
        <span class="text-amber">${rateObj.lastProduced} /min</span>
      `;
      oreRates.appendChild(div);
    });

    // Render Table Rows
    ratesTbody.innerHTML = '';
    const allRates = this.factory.getProductionRates();
    Object.keys(ITEMS).forEach(itemKey => {
      const itemDef = ITEMS[itemKey];
      const r = allRates[itemKey] || { lastProduced: 0, lastConsumed: 0 };
      const net = r.lastProduced - r.lastConsumed;

      let globalCount = 0;
      this.grid.buildings.forEach(b => {
        globalCount += (b.inputs[itemKey] || 0) + (b.outputs[itemKey] || 0);
      });

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="delivery-row-left">
            <div class="mini-icon-box">${itemDef.iconSvg}</div>
            <span>${itemDef.name}</span>
          </div>
        </td>
        <td class="text-green">+${r.lastProduced}</td>
        <td class="text-red">-${r.lastConsumed}</td>
        <td class="${net >= 0 ? 'text-green' : 'text-red'}">${net > 0 ? '+' : ''}${net}</td>
        <td>${globalCount}</td>
      `;
      ratesTbody.appendChild(tr);
    });
  }

  openModal(modalElem, onOpenCallback) {
    this.closeAllModals();
    modalElem.classList.remove('hidden');
    audioManager.playUiClick();
    if (onOpenCallback) onOpenCallback();
  }

  closeAllModals() {
    [this.modalMilestones, this.modalStats, this.modalBlueprints, this.modalHelp].forEach(m => {
      if (m) m.classList.add('hidden');
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}
