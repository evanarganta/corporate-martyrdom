export const TILE_SIZE = 48;
export const WORLD_WIDTH = 120;
export const WORLD_HEIGHT = 120;

export const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

export const DIR_VECTORS = [
  { dx: 0, dy: -1 }, // UP
  { dx: 1, dy: 0 },  // RIGHT
  { dx: 0, dy: 1 },  // DOWN
  { dx: -1, dy: 0 }  // LEFT
];

export const DIR_ANGLES = [0, 90, 180, 270];

// High-fidelity handcrafted SVG icons for all items and buildings (Real industrial game art)
export const SVG_ICONS = {
  // Ores
  iron_ore: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,18 24,8 36,14 42,28 32,40 16,42 6,30" fill="#475569" stroke="#1e293b" stroke-width="2"/>
    <polygon points="12,18 24,8 28,24 16,28" fill="#64748b"/>
    <polygon points="24,8 36,14 28,24" fill="#94a3b8"/>
    <polygon points="36,14 42,28 32,28 28,24" fill="#64748b"/>
    <polygon points="16,28 28,24 32,28 32,40 16,42" fill="#334155"/>
    <polygon points="6,30 12,18 16,28 16,42" fill="#1e293b"/>
    <line x1="20" y1="12" x2="26" y2="15" stroke="#f1f5f9" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  copper_ore: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="14,14 28,6 40,16 38,34 26,44 10,38 6,24" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    <polygon points="14,14 28,6 26,22 16,24" fill="#b45309"/>
    <polygon points="28,6 40,16 32,26 26,22" fill="#d97706"/>
    <polygon points="40,16 38,34 26,44 32,26" fill="#92400e"/>
    <polygon points="16,24 26,22 32,26 26,44 10,38" fill="#78350f"/>
    <polygon points="6,24 14,14 16,24 10,38" fill="#451a03"/>
    <!-- Malachite green vein accents -->
    <path d="M 18,18 Q 24,20 22,28" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
    <line x1="26" y1="10" x2="32" y2="14" stroke="#fde68a" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  coal: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="10,16 22,8 38,12 44,26 34,42 18,44 6,28" fill="#090d16" stroke="#000000" stroke-width="2"/>
    <polygon points="10,16 22,8 24,24 12,26" fill="#1e293b"/>
    <polygon points="22,8 38,12 30,22 24,24" fill="#334155"/>
    <polygon points="38,12 44,26 34,42 30,22" fill="#1e293b"/>
    <polygon points="12,26 24,24 30,22 34,42 18,44" fill="#0f172a"/>
    <polygon points="6,28 10,16 12,26 18,44" fill="#020617"/>
    <line x1="20" y1="11" x2="28" y2="13" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  quartz: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Crystalline needles -->
    <polygon points="24,4 32,20 28,42 20,42 16,20" fill="#0284c7" stroke="#0c4a6e" stroke-width="1.5"/>
    <polygon points="24,4 20,20 20,42 24,42" fill="#38bdf8"/>
    <polygon points="24,4 28,20 28,42 24,42" fill="#bae6fd"/>
    <polygon points="14,14 20,24 16,40 10,38 8,24" fill="#0ea5e9" stroke="#0369a1" stroke-width="1"/>
    <polygon points="34,14 40,24 38,38 32,40 28,24" fill="#7dd3fc" stroke="#0284c7" stroke-width="1"/>
    <line x1="22" y1="8" x2="24" y2="24" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  titanium_ore: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,14 26,6 40,12 44,28 36,42 18,44 6,32" fill="#312e81" stroke="#1e1b4b" stroke-width="2"/>
    <polygon points="12,14 26,6 28,24 14,26" fill="#4f46e5"/>
    <polygon points="26,6 40,12 34,22 28,24" fill="#818cf8"/>
    <polygon points="40,12 44,28 36,42 34,22" fill="#4338ca"/>
    <polygon points="14,26 28,24 34,22 36,42 18,44" fill="#3730a3"/>
    <polygon points="6,32 12,14 14,26 18,44" fill="#1e1b4b"/>
    <line x1="24" y1="9" x2="32" y2="13" stroke="#e0e7ff" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  // Ingots & Smelted
  iron_ingot: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,14 36,14 42,28 6,28" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
    <polygon points="6,28 42,28 38,38 10,38" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <polygon points="10,38 38,38 34,42 14,42" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
    <line x1="14" y1="18" x2="34" y2="18" stroke="#f1f5f9" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  copper_ingot: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,14 36,14 42,28 6,28" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
    <polygon points="6,28 42,28 38,38 10,38" fill="#d97706" stroke="#78350f" stroke-width="2"/>
    <polygon points="10,38 38,38 34,42 14,42" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
    <line x1="14" y1="18" x2="34" y2="18" stroke="#fef3c7" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  silicon_wafer: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
    <circle cx="24" cy="24" r="15" fill="#1e293b"/>
    <!-- Wafer iridescent grid -->
    <line x1="12" y1="18" x2="36" y2="18" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="10" y1="24" x2="38" y2="24" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="12" y1="30" x2="36" y2="30" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="18" y1="12" x2="18" y2="36" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="24" y1="10" x2="24" y2="38" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="30" y1="12" x2="30" y2="36" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2"/>
  </svg>`,

  titanium_bar: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,14 36,14 42,28 6,28" fill="#818cf8" stroke="#312e81" stroke-width="2"/>
    <polygon points="6,28 42,28 38,38 10,38" fill="#6366f1" stroke="#312e81" stroke-width="2"/>
    <polygon points="10,38 38,38 34,42 14,42" fill="#4338ca" stroke="#1e1b4b" stroke-width="1.5"/>
    <line x1="14" y1="18" x2="34" y2="18" stroke="#e0e7ff" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  // Manufactured Components
  iron_plate: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="32" height="28" rx="2" fill="#475569" stroke="#1e293b" stroke-width="2"/>
    <rect x="11" y="13" width="26" height="22" fill="#64748b"/>
    <!-- Rivets -->
    <circle cx="12" cy="14" r="1.5" fill="#cbd5e1"/>
    <circle cx="36" cy="14" r="1.5" fill="#cbd5e1"/>
    <circle cx="12" cy="34" r="1.5" fill="#cbd5e1"/>
    <circle cx="36" cy="34" r="1.5" fill="#cbd5e1"/>
    <line x1="14" y1="16" x2="34" y2="16" stroke="#94a3b8" stroke-width="1"/>
  </svg>`,

  gear: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 22,4 L 26,4 L 27,9 L 32,10 L 36,6 L 39,9 L 36,14 L 39,18 L 44,19 L 44,24 L 44,29 L 39,30 L 36,34 L 39,39 L 36,42 L 32,38 L 27,39 L 26,44 L 22,44 L 21,39 L 16,38 L 12,42 L 9,39 L 12,34 L 9,30 L 4,29 L 4,24 L 4,19 L 9,18 L 12,14 L 9,9 L 12,6 L 16,10 L 21,9 Z" fill="#64748b" stroke="#334155" stroke-width="2"/>
    <circle cx="24" cy="24" r="8" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <circle cx="24" cy="24" r="4" fill="#0f172a"/>
  </svg>`,

  copper_wire: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="24" rx="16" ry="12" fill="none" stroke="#b45309" stroke-width="6"/>
    <ellipse cx="24" cy="24" rx="16" ry="12" fill="none" stroke="#f59e0b" stroke-width="4"/>
    <ellipse cx="24" cy="24" rx="16" ry="12" fill="none" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="8 6"/>
  </svg>`,

  circuit_board: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#064e3b" stroke="#022c22" stroke-width="2"/>
    <!-- Microchip in center -->
    <rect x="18" y="18" width="12" height="12" rx="1" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <!-- PCB copper traces -->
    <path d="M 12,12 L 18,12 L 18,18" stroke="#10b981" stroke-width="1.5" fill="none"/>
    <path d="M 36,12 L 30,12 L 30,18" stroke="#10b981" stroke-width="1.5" fill="none"/>
    <path d="M 12,36 L 18,36 L 18,30" stroke="#10b981" stroke-width="1.5" fill="none"/>
    <path d="M 36,36 L 30,36 L 30,30" stroke="#10b981" stroke-width="1.5" fill="none"/>
    <circle cx="12" cy="12" r="1.5" fill="#34d399"/>
    <circle cx="36" cy="12" r="1.5" fill="#34d399"/>
    <circle cx="12" cy="36" r="1.5" fill="#34d399"/>
    <circle cx="36" cy="36" r="1.5" fill="#34d399"/>
  </svg>`,

  microchip: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="12" width="24" height="24" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <rect x="16" y="16" width="16" height="16" fill="#1e293b"/>
    <!-- Pins -->
    <line x1="8" y1="16" x2="12" y2="16" stroke="#94a3b8" stroke-width="2"/>
    <line x1="8" y1="24" x2="12" y2="24" stroke="#94a3b8" stroke-width="2"/>
    <line x1="8" y1="32" x2="12" y2="32" stroke="#94a3b8" stroke-width="2"/>
    <line x1="36" y1="16" x2="40" y2="16" stroke="#94a3b8" stroke-width="2"/>
    <line x1="36" y1="24" x2="40" y2="24" stroke="#94a3b8" stroke-width="2"/>
    <line x1="36" y1="32" x2="40" y2="32" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="24" cy="24" r="3" fill="#38bdf8"/>
  </svg>`,

  motor: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="14" width="26" height="20" rx="3" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <!-- Copper rotor windings -->
    <rect x="12" y="17" width="18" height="14" rx="2" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
    <line x1="17" y1="17" x2="17" y2="31" stroke="#fde68a" stroke-width="1"/>
    <line x1="22" y1="17" x2="22" y2="31" stroke="#fde68a" stroke-width="1"/>
    <line x1="27" y1="17" x2="27" y2="31" stroke="#fde68a" stroke-width="1"/>
    <!-- Drive shaft -->
    <rect x="34" y="21" width="8" height="6" fill="#cbd5e1" stroke="#475569" stroke-width="1"/>
  </svg>`,

  reinforced_plate: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="2" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <polygon points="10,12 38,12 38,36 10,36" fill="#475569"/>
    <!-- Structural X-brace -->
    <line x1="10" y1="12" x2="38" y2="36" stroke="#94a3b8" stroke-width="3"/>
    <line x1="38" y1="12" x2="10" y2="36" stroke="#94a3b8" stroke-width="3"/>
    <circle cx="24" cy="24" r="3" fill="#cbd5e1" stroke="#334155" stroke-width="1"/>
  </svg>`,

  energy_cell: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="10" width="20" height="30" rx="3" fill="#1e1b4b" stroke="#4338ca" stroke-width="2"/>
    <!-- Glowing core -->
    <rect x="18" y="16" width="12" height="18" rx="2" fill="#ec4899" stroke="#f472b6" stroke-width="1.5"/>
    <polygon points="24,18 20,25 24,25 22,32 28,24 24,24" fill="#fdf2f8"/>
    <!-- Terminals -->
    <rect x="20" y="6" width="8" height="4" rx="1" fill="#e0e7ff"/>
  </svg>`,

  automation_core: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
    <polygon points="24,10 36,18 36,30 24,38 12,30 12,18" fill="#be123c"/>
    <circle cx="24" cy="24" r="6" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2"/>
  </svg>`,

  // Buildings & Machinery
  conveyor_mk1: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="2" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="10" y="12" width="28" height="24" fill="#0f172a"/>
    <!-- Rollers -->
    <line x1="12" y1="16" x2="36" y2="16" stroke="#475569" stroke-width="2"/>
    <line x1="12" y1="24" x2="36" y2="24" stroke="#475569" stroke-width="2"/>
    <line x1="12" y1="32" x2="36" y2="32" stroke="#475569" stroke-width="2"/>
    <!-- Arrow -->
    <polygon points="24,14 18,24 30,24" fill="#f1c40f"/>
  </svg>`,

  conveyor_mk2: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="2" fill="#1e293b" stroke="#f39c12" stroke-width="2"/>
    <rect x="10" y="12" width="28" height="24" fill="#090d16"/>
    <!-- Express Chevrons -->
    <polygon points="24,12 16,22 32,22" fill="#f39c12"/>
    <polygon points="24,24 16,34 32,34" fill="#f39c12"/>
  </svg>`,

  splitter: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <!-- 1 input bottom, 2 outputs top/sides -->
    <polygon points="24,28 20,38 28,38" fill="#f1c40f"/>
    <polygon points="12,18 20,12 20,24" fill="#f1c40f"/>
    <polygon points="36,18 28,12 28,24" fill="#f1c40f"/>
    <circle cx="24" cy="20" r="4" fill="#64748b"/>
  </svg>`,

  merger: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <!-- 2 inputs sides, 1 output top -->
    <polygon points="24,10 18,20 30,20" fill="#2ecc71"/>
    <polygon points="18,30 10,24 10,36" fill="#f1c40f"/>
    <polygon points="30,30 38,24 38,36" fill="#f1c40f"/>
  </svg>`,

  chute_tunnel: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    <path d="M 12,36 Q 24,12 36,36 Z" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
    <ellipse cx="24" cy="32" rx="8" ry="4" fill="#020617"/>
  </svg>`,

  burner_drill: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <circle cx="24" cy="24" r="11" fill="#1e293b" stroke="#d97706" stroke-width="2"/>
    <!-- Rotary cutter head -->
    <line x1="16" y1="16" x2="32" y2="32" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <line x1="32" y1="16" x2="16" y2="32" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="3" fill="#f59e0b"/>
  </svg>`,

  electric_drill: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
    <circle cx="24" cy="24" r="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="24,14 32,24 24,34 16,24" fill="#38bdf8"/>
    <circle cx="24" cy="24" r="4" fill="#f0f9ff"/>
  </svg>`,

  deep_drill: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,6 42,16 42,38 24,44 6,38 6,16" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
    <circle cx="24" cy="26" r="10" fill="#312e81" stroke="#818cf8" stroke-width="2"/>
    <!-- Heavy Drill Diamond -->
    <polygon points="24,18 30,26 24,34 18,26" fill="#c7d2fe"/>
  </svg>`,

  smelter_mk1: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#292524" stroke="#44403c" stroke-width="2"/>
    <polygon points="16,34 32,34 28,18 20,18" fill="#78350f" stroke="#b45309" stroke-width="1.5"/>
    <!-- Lava Crucible glow -->
    <ellipse cx="24" cy="26" rx="6" ry="4" fill="#f59e0b"/>
    <ellipse cx="24" cy="26" rx="3" ry="2" fill="#fef08a"/>
  </svg>`,

  smelter_mk2: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#18181b" stroke="#e11d48" stroke-width="2"/>
    <circle cx="24" cy="24" r="11" fill="#3f3f46" stroke="#f43f5e" stroke-width="2"/>
    <circle cx="24" cy="24" r="6" fill="#fb7185"/>
    <circle cx="24" cy="24" r="3" fill="#fff1f2"/>
  </svg>`,

  assembler_mk1: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <!-- Mechanical robotic arm -->
    <circle cx="16" cy="32" r="4" fill="#64748b"/>
    <line x1="16" y1="32" x2="26" y2="20" stroke="#cbd5e1" stroke-width="3"/>
    <circle cx="26" cy="20" r="3" fill="#94a3b8"/>
    <line x1="26" y1="20" x2="34" y2="28" stroke="#cbd5e1" stroke-width="2.5"/>
    <polygon points="34,28 38,26 36,32" fill="#f59e0b"/>
  </svg>`,

  assembler_mk2: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
    <circle cx="24" cy="24" r="10" fill="#1e293b" stroke="#22d3ee" stroke-width="2"/>
    <circle cx="24" cy="24" r="4" fill="#a5f3fc"/>
    <line x1="24" y1="8" x2="24" y2="14" stroke="#22d3ee" stroke-width="2"/>
    <line x1="24" y1="34" x2="24" y2="40" stroke="#22d3ee" stroke-width="2"/>
  </svg>`,

  power_pole: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Transmission pylon -->
    <line x1="24" y1="6" x2="24" y2="42" stroke="#64748b" stroke-width="3"/>
    <line x1="12" y1="16" x2="36" y2="16" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="14" y1="26" x2="34" y2="26" stroke="#94a3b8" stroke-width="2.5"/>
    <!-- Insulators -->
    <circle cx="12" cy="16" r="2" fill="#f1c40f"/>
    <circle cx="36" cy="16" r="2" fill="#f1c40f"/>
    <circle cx="14" cy="26" r="2" fill="#f1c40f"/>
    <circle cx="34" cy="26" r="2" fill="#f1c40f"/>
  </svg>`,

  coal_generator: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="16" width="32" height="24" rx="2" fill="#27272a" stroke="#52525b" stroke-width="2"/>
    <!-- Smokestacks -->
    <rect x="12" y="6" width="6" height="12" fill="#52525b"/>
    <rect x="22" y="8" width="6" height="10" fill="#52525b"/>
    <!-- Combustion fire port -->
    <ellipse cx="28" cy="28" rx="6" ry="4" fill="#ea580c"/>
    <ellipse cx="28" cy="28" rx="3" ry="2" fill="#fde047"/>
  </svg>`,

  solar_panel: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,14 42,14 38,38 10,38" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
    <!-- Photovoltaic cells grid -->
    <line x1="18" y1="14" x2="19" y2="38" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="30" y1="14" x2="29" y2="38" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="8" y1="26" x2="40" y2="26" stroke="#93c5fd" stroke-width="1.5"/>
  </svg>`,

  accumulator: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="12" width="28" height="28" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
    <rect x="14" y="16" width="20" height="20" rx="2" fill="#0f172a"/>
    <!-- Battery Level Indicator Bars -->
    <rect x="17" y="29" width="14" height="4" fill="#3b82f6"/>
    <rect x="17" y="23" width="14" height="4" fill="#60a5fa"/>
    <rect x="17" y="17" width="14" height="4" fill="#93c5fd"/>
    <!-- Terminals -->
    <rect x="16" y="8" width="4" height="4" fill="#ef4444"/>
    <rect x="28" y="8" width="4" height="4" fill="#3b82f6"/>
  </svg>`,

  storage_chest: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="32" height="28" rx="3" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <rect x="12" y="8" width="24" height="6" rx="2" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Heavy Cargo lock latch -->
    <rect x="21" y="20" width="6" height="8" rx="1" fill="#f59e0b" stroke="#78350f" stroke-width="1"/>
    <line x1="10" y1="24" x2="38" y2="24" stroke="#1e293b" stroke-width="1.5"/>
  </svg>`,

  launchpad: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,40 40,40 36,24 12,24" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <rect x="16" y="12" width="16" height="20" rx="2" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
    <!-- Launch Gantry / Rocket silhouette -->
    <polygon points="24,6 20,16 28,16" fill="#f43f5e"/>
    <rect x="22" y="16" width="4" height="12" fill="#f1f5f9"/>
    <polygon points="18,24 22,24 22,28 18,28" fill="#3b82f6"/>
    <polygon points="30,24 26,24 26,28 30,28" fill="#3b82f6"/>
  </svg>`
};

export const ITEMS = {
  // Raw Ores
  iron_ore: { id: 'iron_ore', name: 'Iron Ore', category: 'ore', color: '#8a9ba8', symbol: 'Fe', iconSvg: SVG_ICONS.iron_ore },
  copper_ore: { id: 'copper_ore', name: 'Copper Ore', category: 'ore', color: '#d97706', symbol: 'Cu', iconSvg: SVG_ICONS.copper_ore },
  coal: { id: 'coal', name: 'Coal', category: 'fuel', color: '#1e293b', symbol: 'C', iconSvg: SVG_ICONS.coal },
  quartz: { id: 'quartz', name: 'Quartz', category: 'ore', color: '#38bdf8', symbol: 'Si', iconSvg: SVG_ICONS.quartz },
  titanium_ore: { id: 'titanium_ore', name: 'Titanium Ore', category: 'ore', color: '#818cf8', symbol: 'Ti', iconSvg: SVG_ICONS.titanium_ore },

  // Smelted Products
  iron_ingot: { id: 'iron_ingot', name: 'Iron Ingot', category: 'smelted', color: '#cbd5e1', symbol: 'Fe-Bar', iconSvg: SVG_ICONS.iron_ingot },
  copper_ingot: { id: 'copper_ingot', name: 'Copper Ingot', category: 'smelted', color: '#f59e0b', symbol: 'Cu-Bar', iconSvg: SVG_ICONS.copper_ingot },
  silicon_wafer: { id: 'silicon_wafer', name: 'Silicon Wafer', category: 'smelted', color: '#00f0ff', symbol: 'Si-Waf', iconSvg: SVG_ICONS.silicon_wafer },
  titanium_bar: { id: 'titanium_bar', name: 'Titanium Ingot', category: 'smelted', color: '#a5b4fc', symbol: 'Ti-Bar', iconSvg: SVG_ICONS.titanium_bar },

  // Manufactured Components
  iron_plate: { id: 'iron_plate', name: 'Iron Plate', category: 'component', color: '#94a3b8', symbol: 'Plate', iconSvg: SVG_ICONS.iron_plate },
  gear: { id: 'gear', name: 'Gear', category: 'component', color: '#64748b', symbol: 'Gear', iconSvg: SVG_ICONS.gear },
  copper_wire: { id: 'copper_wire', name: 'Copper Wire', category: 'component', color: '#fbbf24', symbol: 'Wire', iconSvg: SVG_ICONS.copper_wire },
  circuit_board: { id: 'circuit_board', name: 'Circuit Board', category: 'component', color: '#10b981', symbol: 'PCB', iconSvg: SVG_ICONS.circuit_board },
  microchip: { id: 'microchip', name: 'Microprocessor', category: 'component', color: '#06b6d4', symbol: 'CPU', iconSvg: SVG_ICONS.microchip },
  motor: { id: 'motor', name: 'Electric Motor', category: 'component', color: '#3b82f6', symbol: 'Motor', iconSvg: SVG_ICONS.motor },
  reinforced_plate: { id: 'reinforced_plate', name: 'Steel Frame', category: 'component', color: '#475569', symbol: 'Frame', iconSvg: SVG_ICONS.reinforced_plate },
  energy_cell: { id: 'energy_cell', name: 'Power Cell', category: 'component', color: '#ec4899', symbol: 'Cell', iconSvg: SVG_ICONS.energy_cell },
  automation_core: { id: 'automation_core', name: 'Control Core', category: 'component', color: '#f43f5e', symbol: 'Core', iconSvg: SVG_ICONS.automation_core }
};

export const BUILDINGS = {
  // Logistics
  conveyor_mk1: {
    id: 'conveyor_mk1',
    name: 'Conveyor',
    category: 'logistics',
    width: 1,
    height: 1,
    directional: true,
    speed: 2.0,
    powerDemand: 0,
    iconSvg: SVG_ICONS.conveyor_mk1,
    cost: [{ item: 'iron_plate', count: 1 }]
  },
  conveyor_mk2: {
    id: 'conveyor_mk2',
    name: 'Express Conveyor',
    category: 'logistics',
    width: 1,
    height: 1,
    directional: true,
    speed: 4.5,
    powerDemand: 0,
    iconSvg: SVG_ICONS.conveyor_mk2,
    cost: [{ item: 'iron_plate', count: 2 }, { item: 'gear', count: 1 }]
  },
  splitter: {
    id: 'splitter',
    name: 'Splitter',
    category: 'logistics',
    width: 1,
    height: 1,
    directional: true,
    speed: 2.5,
    powerDemand: 0,
    iconSvg: SVG_ICONS.splitter,
    cost: [{ item: 'iron_plate', count: 4 }, { item: 'gear', count: 2 }]
  },
  merger: {
    id: 'merger',
    name: 'Merger',
    category: 'logistics',
    width: 1,
    height: 1,
    directional: true,
    speed: 2.5,
    powerDemand: 0,
    iconSvg: SVG_ICONS.merger,
    cost: [{ item: 'iron_plate', count: 4 }, { item: 'gear', count: 2 }]
  },
  chute_tunnel: {
    id: 'chute_tunnel',
    name: 'Underground Chute',
    category: 'logistics',
    width: 1,
    height: 1,
    directional: true,
    speed: 3.5,
    tunnelDistance: 5,
    powerDemand: 0,
    iconSvg: SVG_ICONS.chute_tunnel,
    cost: [{ item: 'iron_plate', count: 6 }, { item: 'gear', count: 4 }]
  },

  // Extraction
  burner_drill: {
    id: 'burner_drill',
    name: 'Mechanical Drill',
    category: 'extraction',
    width: 2,
    height: 2,
    directional: true,
    miningRate: 1.0,
    powerDemand: 20,
    iconSvg: SVG_ICONS.burner_drill,
    cost: [{ item: 'iron_plate', count: 8 }]
  },
  electric_drill: {
    id: 'electric_drill',
    name: 'Electric Drill',
    category: 'extraction',
    width: 2,
    height: 2,
    directional: true,
    miningRate: 2.5,
    powerDemand: 40,
    iconSvg: SVG_ICONS.electric_drill,
    cost: [{ item: 'iron_plate', count: 12 }, { item: 'copper_wire', count: 10 }, { item: 'gear', count: 5 }]
  },
  deep_drill: {
    id: 'deep_drill',
    name: 'Heavy Bore Extractor',
    category: 'extraction',
    width: 3,
    height: 3,
    directional: true,
    miningRate: 6.0,
    powerDemand: 120,
    iconSvg: SVG_ICONS.deep_drill,
    cost: [{ item: 'reinforced_plate', count: 10 }, { item: 'motor', count: 6 }, { item: 'microchip', count: 4 }]
  },

  // Processing
  smelter_mk1: {
    id: 'smelter_mk1',
    name: 'Smelter',
    category: 'processing',
    width: 2,
    height: 2,
    directional: true,
    speedMultiplier: 1.0,
    powerDemand: 30,
    iconSvg: SVG_ICONS.smelter_mk1,
    cost: [{ item: 'iron_plate', count: 10 }, { item: 'copper_wire', count: 8 }]
  },
  smelter_mk2: {
    id: 'smelter_mk2',
    name: 'Electric Foundry',
    category: 'processing',
    width: 3,
    height: 3,
    directional: true,
    speedMultiplier: 2.5,
    powerDemand: 90,
    iconSvg: SVG_ICONS.smelter_mk2,
    cost: [{ item: 'reinforced_plate', count: 12 }, { item: 'circuit_board', count: 8 }, { item: 'motor', count: 4 }]
  },
  assembler_mk1: {
    id: 'assembler_mk1',
    name: 'Fabricator',
    category: 'processing',
    width: 3,
    height: 3,
    directional: true,
    speedMultiplier: 1.0,
    powerDemand: 50,
    iconSvg: SVG_ICONS.assembler_mk1,
    cost: [{ item: 'iron_plate', count: 15 }, { item: 'gear', count: 10 }, { item: 'circuit_board', count: 4 }]
  },
  assembler_mk2: {
    id: 'assembler_mk2',
    name: 'Precision Assembler',
    category: 'processing',
    width: 3,
    height: 3,
    directional: true,
    speedMultiplier: 2.2,
    powerDemand: 120,
    iconSvg: SVG_ICONS.assembler_mk2,
    cost: [{ item: 'reinforced_plate', count: 16 }, { item: 'microchip', count: 10 }, { item: 'motor', count: 8 }]
  },

  // Power
  wire_tool: {
    id: 'wire_tool',
    name: 'Power Cable',
    category: 'power',
    width: 1,
    height: 1,
    directional: false,
    powerDemand: 0,
    iconSvg: SVG_ICONS.copper_wire,
    cost: [{ item: 'copper_wire', count: 1 }]
  },
  power_pole: {
    id: 'power_pole',
    name: 'LV Pole',
    category: 'power',
    width: 1,
    height: 1,
    directional: false,
    supplyRadius: 8,
    wireReach: 8,
    powerDemand: 0,
    iconSvg: SVG_ICONS.power_pole,
    cost: [{ item: 'iron_plate', count: 2 }, { item: 'copper_wire', count: 4 }]
  },
  coal_generator: {
    id: 'coal_generator',
    name: 'Thermal Generator',
    category: 'power',
    width: 2,
    height: 2,
    directional: true,
    powerOutput: 150,
    wireReach: 8,
    fuelPerSec: 0.15,
    powerDemand: 0,
    iconSvg: SVG_ICONS.coal_generator,
    cost: [{ item: 'iron_plate', count: 12 }, { item: 'gear', count: 6 }, { item: 'copper_wire', count: 8 }]
  },
  solar_panel: {
    id: 'solar_panel',
    name: 'Solar Panel',
    category: 'power',
    width: 1,
    height: 1,
    directional: false,
    powerOutput: 20,
    wireReach: 8,
    powerDemand: 0,
    iconSvg: SVG_ICONS.solar_panel,
    cost: [{ item: 'iron_plate', count: 10 }, { item: 'copper_wire', count: 16 }, { item: 'silicon_wafer', count: 6 }]
  },
  accumulator: {
    id: 'accumulator',
    name: 'Accumulator',
    category: 'power',
    width: 2,
    height: 2,
    directional: false,
    capacity: 2000,
    maxDischargeRate: 120,
    powerDemand: 0,
    iconSvg: SVG_ICONS.accumulator,
    cost: [{ item: 'iron_plate', count: 8 }, { item: 'copper_wire', count: 12 }, { item: 'circuit_board', count: 4 }]
  },

  // Storage & Hub
  storage_chest: {
    id: 'storage_chest',
    name: 'Storage Silo',
    category: 'logistics_adv',
    width: 2,
    height: 2,
    directional: true,
    capacity: 500,
    powerDemand: 0,
    iconSvg: SVG_ICONS.storage_chest,
    cost: [{ item: 'iron_plate', count: 8 }, { item: 'gear', count: 4 }]
  },
  launchpad: {
    id: 'launchpad',
    name: 'Delivery Station',
    category: 'logistics_adv',
    width: 4,
    height: 4,
    directional: false,
    powerDemand: 0,
    iconSvg: SVG_ICONS.launchpad,
    cost: [{ item: 'reinforced_plate', count: 20 }, { item: 'motor', count: 10 }, { item: 'circuit_board', count: 15 }]
  }
};

export const RECIPES = [
  // Smelting
  {
    id: 'smelt_iron',
    name: 'Iron Ingot',
    category: 'smelting',
    machineType: ['smelter_mk1', 'smelter_mk2'],
    duration: 1.5,
    iconSvg: SVG_ICONS.iron_ingot,
    inputs: [{ item: 'iron_ore', count: 1 }],
    outputs: [{ item: 'iron_ingot', count: 1 }]
  },
  {
    id: 'smelt_copper',
    name: 'Copper Ingot',
    category: 'smelting',
    machineType: ['smelter_mk1', 'smelter_mk2'],
    duration: 1.5,
    iconSvg: SVG_ICONS.copper_ingot,
    inputs: [{ item: 'copper_ore', count: 1 }],
    outputs: [{ item: 'copper_ingot', count: 1 }]
  },
  {
    id: 'smelt_silicon',
    name: 'Silicon Wafer',
    category: 'smelting',
    machineType: ['smelter_mk1', 'smelter_mk2'],
    duration: 2.5,
    iconSvg: SVG_ICONS.silicon_wafer,
    inputs: [{ item: 'quartz', count: 2 }],
    outputs: [{ item: 'silicon_wafer', count: 1 }]
  },
  {
    id: 'smelt_titanium',
    name: 'Titanium Ingot',
    category: 'smelting',
    machineType: ['smelter_mk1', 'smelter_mk2'],
    duration: 3.0,
    iconSvg: SVG_ICONS.titanium_bar,
    inputs: [{ item: 'titanium_ore', count: 2 }, { item: 'coal', count: 1 }],
    outputs: [{ item: 'titanium_bar', count: 1 }]
  },

  // Assembly
  {
    id: 'craft_iron_plate',
    name: 'Iron Plate',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 1.0,
    iconSvg: SVG_ICONS.iron_plate,
    inputs: [{ item: 'iron_ingot', count: 1 }],
    outputs: [{ item: 'iron_plate', count: 2 }]
  },
  {
    id: 'craft_gear',
    name: 'Gear',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 1.2,
    iconSvg: SVG_ICONS.gear,
    inputs: [{ item: 'iron_ingot', count: 2 }],
    outputs: [{ item: 'gear', count: 1 }]
  },
  {
    id: 'craft_copper_wire',
    name: 'Copper Wire',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 1.0,
    iconSvg: SVG_ICONS.copper_wire,
    inputs: [{ item: 'copper_ingot', count: 1 }],
    outputs: [{ item: 'copper_wire', count: 3 }]
  },
  {
    id: 'craft_circuit_board',
    name: 'Circuit Board',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 2.0,
    iconSvg: SVG_ICONS.circuit_board,
    inputs: [{ item: 'iron_plate', count: 1 }, { item: 'copper_wire', count: 3 }],
    outputs: [{ item: 'circuit_board', count: 1 }]
  },
  {
    id: 'craft_motor',
    name: 'Electric Motor',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 3.0,
    iconSvg: SVG_ICONS.motor,
    inputs: [{ item: 'iron_plate', count: 2 }, { item: 'gear', count: 2 }, { item: 'copper_wire', count: 4 }],
    outputs: [{ item: 'motor', count: 1 }]
  },
  {
    id: 'craft_microchip',
    name: 'Microprocessor',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 3.5,
    iconSvg: SVG_ICONS.microchip,
    inputs: [{ item: 'silicon_wafer', count: 2 }, { item: 'circuit_board', count: 1 }, { item: 'copper_wire', count: 2 }],
    outputs: [{ item: 'microchip', count: 1 }]
  },
  {
    id: 'craft_reinforced_plate',
    name: 'Steel Frame',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 3.0,
    iconSvg: SVG_ICONS.reinforced_plate,
    inputs: [{ item: 'iron_plate', count: 4 }, { item: 'gear', count: 2 }],
    outputs: [{ item: 'reinforced_plate', count: 1 }]
  },
  {
    id: 'craft_energy_cell',
    name: 'Power Cell',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 4.0,
    iconSvg: SVG_ICONS.energy_cell,
    inputs: [{ item: 'silicon_wafer', count: 2 }, { item: 'copper_wire', count: 6 }, { item: 'titanium_bar', count: 1 }],
    outputs: [{ item: 'energy_cell', count: 1 }]
  },
  {
    id: 'craft_automation_core',
    name: 'Control Core',
    category: 'assembly',
    machineType: ['assembler_mk1', 'assembler_mk2'],
    duration: 5.0,
    iconSvg: SVG_ICONS.automation_core,
    inputs: [{ item: 'microchip', count: 2 }, { item: 'motor', count: 2 }, { item: 'energy_cell', count: 1 }],
    outputs: [{ item: 'automation_core', count: 1 }]
  }
];

export const TECH_MILESTONES = [
  {
    id: 'tier0_landing',
    tier: 0,
    title: 'Basic Logistics',
    description: 'Smelt raw ore into ingots and deliver them to the Central Hub.',
    costRP: 0,
    deliveries: [
      { item: 'iron_ingot', target: 20 }
    ],
    unlockedBuildings: ['conveyor_mk1', 'burner_drill', 'smelter_mk1', 'storage_chest', 'power_pole', 'solar_panel', 'wire_tool'],
    unlockedRecipes: ['smelt_iron', 'smelt_copper'],
    unlockedItems: ['iron_ore', 'copper_ore', 'coal', 'iron_ingot', 'copper_ingot']
  },
  {
    id: 'tier1_metallurgy',
    tier: 1,
    title: 'Electrification',
    description: 'Power grid networks, electric drills, and component manufacturing.',
    costRP: 50,
    deliveries: [
      { item: 'iron_ingot', target: 60 },
      { item: 'copper_ingot', target: 40 }
    ],
    unlockedBuildings: ['electric_drill', 'coal_generator', 'assembler_mk1', 'splitter', 'merger'],
    unlockedRecipes: ['craft_iron_plate', 'craft_gear', 'craft_copper_wire'],
    unlockedItems: ['iron_plate', 'gear', 'copper_wire']
  },
  {
    id: 'tier2_electronics',
    tier: 2,
    title: 'Circuitry',
    description: 'Silicon processing, logic circuit boards, and motors.',
    costRP: 150,
    deliveries: [
      { item: 'iron_plate', target: 120 },
      { item: 'gear', target: 60 },
      { item: 'copper_wire', target: 150 }
    ],
    unlockedBuildings: ['chute_tunnel', 'solar_panel', 'accumulator'],
    unlockedRecipes: ['smelt_silicon', 'craft_circuit_board', 'craft_motor', 'craft_reinforced_plate'],
    unlockedItems: ['quartz', 'silicon_wafer', 'circuit_board', 'motor', 'reinforced_plate']
  },
  {
    id: 'tier3_advanced_logistics',
    tier: 3,
    title: 'High-Speed Logistics',
    description: 'Express conveyor belts, foundries, and microprocessors.',
    costRP: 350,
    deliveries: [
      { item: 'circuit_board', target: 80 },
      { item: 'motor', target: 40 },
      { item: 'silicon_wafer', target: 60 }
    ],
    unlockedBuildings: ['conveyor_mk2', 'smelter_mk2', 'assembler_mk2'],
    unlockedRecipes: ['craft_microchip', 'smelt_titanium'],
    unlockedItems: ['titanium_ore', 'titanium_bar', 'microchip']
  },
  {
    id: 'tier4_orbital_uplink',
    tier: 4,
    title: 'Advanced Automation',
    description: 'Heavy bore extractors and high-tier control cores.',
    costRP: 750,
    deliveries: [
      { item: 'microchip', target: 100 },
      { item: 'titanium_bar', target: 80 },
      { item: 'reinforced_plate', target: 60 }
    ],
    unlockedBuildings: ['deep_drill', 'launchpad'],
    unlockedRecipes: ['craft_energy_cell', 'craft_automation_core'],
    unlockedItems: ['energy_cell', 'automation_core']
  }
];
