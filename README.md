# Created Games using AI

Small games built with the help of AI assistants.

## Store Tycoon

A single-player store-management game. Choose a difficulty, stock products, set prices, run sales, and manage cash, reputation, rent, upgrades, and random events.

### Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
git clone https://github.com/NurlanSHM/Created-Games-using-AI.git
cd Created-Games-using-AI
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

### Build for production

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

### Stack

- React with Vite
- Tailwind CSS 4
- Lucide React icons
- `tw-animate-css` for the entrance animations used in the game

The game component is in [`Store Tycoon.tsx`](./Store%20Tycoon.tsx); the files under `src/` provide the browser entry point and base styles.
