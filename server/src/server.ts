/**
 * ADVCM Volleyball Mascot Vote — lightweight Express backend.
 *
 * Stores a binary vote: 0 = Jaguar, 1 = Raccoon.
 * Votes are kept in memory for fast reads and persisted to disk after each
 * new device vote. In Railway, mount a persistent volume at /app/data so the
 * JSON file survives image rebuilds and redeploys.
 */
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3001;

const JAGUAR = 0;
const RACCOON = 1;
type Vote = typeof JAGUAR | typeof RACCOON;
type VoteState = {
  votes: Record<string, Vote>;
};

const DATA_DIR = process.env.VOTES_DATA_DIR
  ? path.resolve(process.env.VOTES_DATA_DIR)
  : process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.resolve(process.env.RAILWAY_VOLUME_MOUNT_PATH)
    : path.resolve(__dirname, '../../data');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');

// --- In-memory store (counts only — tiny footprint) ----------------------
const tally = { [JAGUAR]: 0, [RACCOON]: 0 };
let total = 0;

// One vote per device. A Set of UUID strings is ~40 B each → thousands of
// voters stay in a few hundred KB, well under the 0.5 GB tier.
const votedDevices = new Set<string>();

function emptyState(): VoteState {
  return { votes: {} };
}

function isVote(value: unknown): value is Vote {
  return value === JAGUAR || value === RACCOON;
}

function loadState(): VoteState {
  if (!fs.existsSync(VOTES_FILE)) return emptyState();

  try {
    const parsed = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8')) as Partial<VoteState>;
    const votes = Object.entries(parsed.votes ?? {}).reduce<Record<string, Vote>>((acc, [deviceId, vote]) => {
      if (typeof deviceId === 'string' && isVote(vote)) acc[deviceId] = vote;
      return acc;
    }, {});

    return { votes };
  } catch (error) {
    console.error(`Could not read vote state at ${VOTES_FILE}`, error);
    return emptyState();
  }
}

function saveState(state: VoteState): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpFile = `${VOTES_FILE}.tmp`;
  fs.writeFileSync(tmpFile, `${JSON.stringify(state)}\n`, 'utf8');
  fs.renameSync(tmpFile, VOTES_FILE);
}

const voteState = loadState();
for (const [deviceId, vote] of Object.entries(voteState.votes)) {
  votedDevices.add(deviceId);
  tally[vote] += 1;
  total += 1;
}

function recordVote(deviceId: string, vote: Vote): void {
  voteState.votes[deviceId] = vote;
  tally[vote] += 1;
  total += 1;
  saveState(voteState);
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
    recordVote(deviceId, vote);
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
const clientDist = process.env.CLIENT_DIST_DIR
  ? path.resolve(process.env.CLIENT_DIST_DIR)
  : path.resolve(__dirname, '../../client/dist');
const clientIndex = path.join(clientDist, 'index.html');

if (!fs.existsSync(clientIndex)) {
  console.warn(`Client build not found at ${clientIndex}`);
}

app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  if (!fs.existsSync(clientIndex)) {
    return res.status(500).send('Client build not found. Check the Railway root directory and build output.');
  }

  return res.sendFile(clientIndex);
});

app.listen(PORT, () => {
  console.log(`ADVCM mascot server listening on http://localhost:${PORT}`);
});
