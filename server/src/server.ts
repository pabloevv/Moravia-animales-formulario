/**
 * ADVCM Volleyball Mascot Vote — lightweight Express backend.
 *
 * Stores a binary vote: 0 = Jaguar, 1 = Raccoon.
 * For now votes live in memory (counts only) to stay well under the
 * 0.5 GB RAM hobby tier. Swap `recordVote` for an append to the volume
 * (e.g. a single newline-delimited file or SQLite) when persistence is needed.
 */
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3001;

const JAGUAR = 0;
const RACCOON = 1;

// --- In-memory store (counts only — tiny footprint) ----------------------
const tally = { [JAGUAR]: 0, [RACCOON]: 0 };
let total = 0;

// One vote per device. A Set of UUID strings is ~40 B each → thousands of
// voters stay in a few hundred KB, well under the 0.5 GB tier.
const votedDevices = new Set<string>();

function recordVote(vote: 0 | 1): void {
  tally[vote] += 1;
  total += 1;
  // FUTURE: persist to the 0.5 GB volume, e.g.
  //   fs.appendFileSync(path.join(DATA_DIR, 'votes.log'), `${deviceId},${vote}\n`);
}

// --- App -----------------------------------------------------------------
const app = express();
app.use(cors()); // open CORS for local dev; lock to your domain in prod
app.use(express.json({ limit: '4kb' })); // votes are tiny; cap the body

/**
 * POST /api/vote
 * Body: { "vote": 0 | 1, "deviceId": string }  (0 = Jaguar, 1 = Raccoon)
 * Idempotent per device: a repeat from the same device returns the standings
 * without counting again. Responds 200 with the current tally + `counted`.
 */
app.post('/api/vote', (req: Request, res: Response) => {
  const { vote, deviceId } = req.body ?? {};
  if (vote !== JAGUAR && vote !== RACCOON) {
    return res.status(400).json({ error: 'vote must be 0 (Jaguar) or 1 (Raccoon)' });
  }
  if (typeof deviceId !== 'string' || deviceId.length < 8 || deviceId.length > 64) {
    return res.status(400).json({ error: 'deviceId (8–64 chars) is required' });
  }

  let counted = false;
  if (!votedDevices.has(deviceId)) {
    votedDevices.add(deviceId);
    recordVote(vote);
    counted = true;
  }
  return res.json({ jaguar: tally[JAGUAR], raccoon: tally[RACCOON], total, counted });
});

/** GET /api/results — current tally (handy for an admin/results view). */
app.get('/api/results', (_req: Request, res: Response) => {
  res.json({ jaguar: tally[JAGUAR], raccoon: tally[RACCOON], total });
});

/** Health check for the hosting platform. */
app.get('/api/health', (_req: Request, res: Response) => res.json({ ok: true }));

// --- Serve the built client in production --------------------------------
// One process serves API + static SPA, keeping the deployment lightweight.
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.listen(PORT, () => {
  console.log(`ADVCM mascot server listening on http://localhost:${PORT}`);
});
