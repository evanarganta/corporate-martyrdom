import Phaser from 'phaser';
import { MainGameScene } from './scenes/MainGameScene.js';
import { Grid } from './simulation/Grid.js';
import { PowerGrid } from './simulation/PowerGrid.js';
import { LogisticsEngine } from './simulation/LogisticsEngine.js';
import { FactoryEngine } from './simulation/FactoryEngine.js';
import { MilestoneManager } from './simulation/MilestoneManager.js';
import { SaveManager } from './simulation/SaveManager.js';
import { UIManager } from './ui/UIManager.js';

window.addEventListener('DOMContentLoaded', () => {
  const grid = new Grid();
  const powerGrid = new PowerGrid(grid);
  const logistics = new LogisticsEngine(grid);
  const milestoneManager = new MilestoneManager();
  const factory = new FactoryEngine(grid, logistics, milestoneManager);

  const hasSave = localStorage.getItem(SaveManager.SAVE_KEY);
  if (hasSave) {
    SaveManager.load(grid, milestoneManager);
  } else {
    const drill = grid.placeBuilding('burner_drill', 53, 54, 1);
    
    grid.placeBuilding('conveyor_mk1', 55, 55, 1);
    grid.placeBuilding('conveyor_mk1', 56, 55, 1);
    grid.placeBuilding('conveyor_mk1', 57, 55, 1);

    const smelter = grid.placeBuilding('smelter_mk1', 58, 54, 1);
    if (smelter) smelter.recipeId = 'smelt_iron';

    const hub = grid.placeBuilding('launchpad', 63, 53, 0);

    grid.placeBuilding('conveyor_mk1', 60, 55, 0);
    grid.placeBuilding('conveyor_mk1', 60, 54, 0);
    grid.placeBuilding('conveyor_mk1', 60, 53, 0);
    grid.placeBuilding('conveyor_mk1', 60, 52, 0);
    grid.placeBuilding('storage_chest', 60, 50, 1);
    grid.placeBuilding('conveyor_mk1', 62, 51, 2);
    grid.placeBuilding('conveyor_mk1', 62, 52, 2);
    grid.placeBuilding('conveyor_mk1', 62, 53, 1);

    const solar1 = grid.placeBuilding('solar_panel', 52, 60, 0);
    const solar2 = grid.placeBuilding('solar_panel', 52, 62, 0);
    const solar3 = grid.placeBuilding('solar_panel', 52, 64, 0);
    const pole1 = grid.placeBuilding('power_pole', 57, 62, 0);
    const pole2 = grid.placeBuilding('power_pole', 57, 56, 0);
    const pole3 = grid.placeBuilding('power_pole', 62, 57, 0);

    if (solar1 && pole1) grid.addWire(solar1, pole1);
    if (solar2 && pole1) grid.addWire(solar2, pole1);
    if (solar3 && pole1) grid.addWire(solar3, pole1);
    if (pole1 && pole2) grid.addWire(pole1, pole2);
    if (pole2 && pole3) grid.addWire(pole2, pole3);
    if (pole2 && drill) grid.addWire(pole2, drill);
    if (pole2 && smelter) grid.addWire(pole2, smelter);
    if (pole3 && hub) grid.addWire(pole3, hub);
  }

  const sceneInstance = new MainGameScene();

  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0b0f19',
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: sceneInstance
  };

  sceneInstance.initSimulation({
    grid,
    powerGrid,
    logistics,
    factory,
    milestoneManager
  });

  const game = new Phaser.Game(config);

  const uiManager = new UIManager(sceneInstance, grid, powerGrid, logistics, factory, milestoneManager);
  sceneInstance.uiManager = uiManager;

  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
});
