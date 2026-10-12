# PlayLab

Interactive educational games platform for secondary school students.
Subjects, game catalogue, play, and a local-only score leaderboard.

## Tech

- Vite 5 + React 18 + TypeScript (strict)
- React Router 7
- Tailwind CSS 3

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + bundle to dist/
npm run preview    # serve dist/
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home, 17 subject cards |
| `/subject/:subject` | Subject games + topic / form filter |
| `/game/:subject/:gameId` | Game info + iframe + leaderboard |
| `/profile` | This device's play history |

## Local data

- `localStorage.playlab-lang` — `en` or `zh`
- `localStorage.playlab-scores` — append-only score history

## Games

Games live under `public/games/{subject}/{gameId}/index.html`.
The catalogue in `src/data/catalog.ts` registers each game.
At start, only one test page exists: `public/games/tools/score-check/`.
