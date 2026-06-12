# ADVCM · ¿Jaguar o Mapache?

Mobile-first volleyball mascot vote for **Asociación Deportiva Voleibol Corazón
de Moravia**. Players explore each mascot on a flippable volleyball court — the
six positions hold what the **Jaguar** (explosive power) and the **Mapache /
Raccoon** (tactical intelligence) represent, on the court and for Moravia — then
cast a single vote. The result is silently recorded as a binary vote:
`0 = Jaguar`, `1 = Raccoon`.

> Content rules: only Jaguar vs Raccoon, no specific names, no religious
> references. Mascot images and final copy are placeholders pending official
> assets.

## Folder structure

```
.
├── client/                 # React + TypeScript + Vite + Mantine (mobile-first SPA)
│   ├── public/assets/      # logos & mascot images (webp/svg)
│   └── src/
│       ├── components/     # StartScreen, LearnCourt, CourtFace, ChooseScreen, ResultScreen, Confetti
│       ├── data/mascots.ts # mascot info across the 6 court positions (single source of copy)
│       ├── api.ts          # silent POST /api/vote
│       ├── theme.ts        # Mantine volleyball theme
│       ├── types.ts        # JAGUAR=0 / RACCOON=1, stages, court types
│       └── App.tsx         # stage machine: start → learn → choose → result
└── server/                 # Node.js + Express (lightweight vote store)
    └── src/server.ts       # POST /api/vote, GET /api/results, serves built client
```

## Run locally

Two terminals:

```bash
# 1) backend  (http://localhost:3001)
cd server && npm install && npm run dev

# 2) frontend (http://localhost:5173, proxies /api → :3001)
cd client && npm install && npm run dev
```

## Production build (single lightweight process)

```bash
cd client && npm install && npm run build   # outputs client/dist
cd ../server && npm install && npm run build && npm start
```

The Express server serves `client/dist` **and** the API on one port — ideal for
the Free/Hobby tier (0.5 GB RAM / 0.5 GB volume).

## API

| Method | Route          | Body              | Result                         |
|--------|----------------|-------------------|--------------------------------|
| POST   | `/api/vote`    | `{ "vote": 0\|1 }`| `204` — records the vote       |
| GET    | `/api/results` | —                 | `{ jaguar, raccoon, total }`   |
| GET    | `/api/health`  | —                 | `{ ok: true }`                 |

Votes are kept **in memory** (counts only) for now. To persist on the volume,
replace `recordVote` in `server/src/server.ts` with an append to a file or
SQLite — the function is isolated for exactly this swap.

## Notes / TODO when official assets arrive

- UI copy is **Spanish** (the Moravia athletes). All quiz text lives in
  `client/src/data/questions.ts`; result text in `ResultScreen.tsx`.
- Replace placeholder images in `client/public/assets/` and the taglines in
  `IntroScreen.tsx` / `ResultScreen.tsx` with official Jaguar & Raccoon values.
- Mascot images currently use the `*-dark.webp` variants for the dark UI; use
  `*-light.webp` if you switch to a light theme.
```
