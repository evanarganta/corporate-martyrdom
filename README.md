# Corporate Martyrdom

<p align="justify">Corporate Martyrdom is a browser-based factory automation simulator inspired by the likes of Satisfactory, Mindustry, and Industralist. Build a production line, route materials through conveyors and storage, manage a component-based power grid, and deliver goods to grow your small part in the superstructure.</p>

<br><img width="100%" alt="gambar" src="https://github.com/user-attachments/assets/92a3f693-8298-464d-bc23-e63986dc1e3f" /><br>

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
| `WASD`, arrow keys, or click + holding left click | Pan the camera |
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

No license is included yet.
