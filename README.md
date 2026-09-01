# Corporate Martyrdom

Corporate Martyrdom is a browser-based factory automation simulator built with Phaser and Vite. Build a production line, route materials through conveyors and storage, manage a component-based power grid, and deliver goods to complete milestones.

## Features

- Build extraction, processing, logistics, storage, and power infrastructure.
- Route items through conveyors, including 90-degree turns and storage buffers.
- Start with a solar-powered factory layout.
- Connect electrical components with range-limited links owned by the structures—not the cable tool.
- Progress through milestone deliveries and unlock additional technology.

## Getting started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |

## Controls

| Input | Action |
| --- | --- |
| `WASD` or arrow keys | Pan the camera |
| Mouse wheel | Zoom |
| `1`–`9` | Select a hotbar item; press again to cancel |
| `Z`, `X`, `C`, `V`, `B` | Switch build category |
| `R` | Rotate the selected building |
| `Q` | Cancel placement or enter demolition mode |
| `E` or left click | Confirm placement/action |
| `T` | Open the research matrix |
| `P` | Open production analytics |
| `Space` | Pause or resume |
| `Esc` | Close open panels |

## Project structure

```text
src/
├── core/        # Building definitions, textures, and audio
├── scenes/      # Phaser scene and interaction/rendering logic
├── simulation/  # Grid, logistics, power, milestones, and saves
└── ui/          # DOM-based HUD, inspectors, and modals
```

## GitHub publishing

This repository intentionally excludes `node_modules/`, `dist/`, local environment files, and editor/OS metadata. Commit the source files and `package-lock.json`.

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/evanarganta/corporate-martyrdom.git
git push -u origin main
```

No license is included yet.
