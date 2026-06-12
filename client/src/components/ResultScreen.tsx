import { Stack, Title, Text, Box } from '@mantine/core';
import { IconBallVolleyball, IconCrown } from '@tabler/icons-react';
import { JAGUAR, RACCOON, type Mascot } from '../types';
import type { Results } from '../api';

interface Props {
  winner: Mascot;
  results: Results | null;
  alreadyVoted: boolean;
}

const COPY = {
  [JAGUAR]: {
    name: 'Jaguar',
    img: '/assets/jaguar-dark.webp',
    headline: '¡Eres el Jaguar!',
    body: 'Poder explosivo y liderazgo feroz. Cuando el punto pesa, atacas sin dudar y arrastras al equipo contigo.',
  },
  [RACCOON]: {
    name: 'Mapache',
    img: '/assets/raccoon-dark.webp',
    headline: '¡Eres el Mapache!',
    body: 'Inteligencia táctica, adaptabilidad y resiliencia. Lees el juego, encuentras el hueco y resistes más que nadie.',
  },
} as const;

const SET_POINTS = 25;
const SETS_TO_WIN = 3; // best-of-5 match

/**
 * Volleyball reading of the raw tallies: every vote is a point, every
 * 25 points banks one set for that team, the remainder is the live score
 * of the current set. First team to 3 sets is match champion.
 */
function scoreboard(r: Results) {
  const setsJ = Math.floor(r.jaguar / SET_POINTS);
  const setsR = Math.floor(r.raccoon / SET_POINTS);
  const champion =
    setsJ >= SETS_TO_WIN && setsJ > setsR
      ? ('jaguar' as const)
      : setsR >= SETS_TO_WIN && setsR > setsJ
        ? ('raccoon' as const)
        : null;
  return {
    ptsJ: r.jaguar % SET_POINTS,
    ptsR: r.raccoon % SET_POINTS,
    setsJ,
    setsR,
    setNo: setsJ + setsR + 1,
    champion,
  };
}

/** Mascot logo grows with vote share and banked sets. */
function logoSize(votes: number, total: number, sets: number) {
  const share = total > 0 ? votes / total : 0.5;
  return Math.round(Math.min(150, Math.max(64, 58 + share * 52 + sets * 8)));
}

function Scoreboard({ results, winner, alreadyVoted }: { results: Results; winner: Mascot; alreadyVoted: boolean }) {
  const { jaguar, raccoon, total } = results;
  const sb = scoreboard(results);

  // The voter's own ballot just closed a set if it pushed their team to a
  // multiple of 25 (approximation — totals only, no vote ordering).
  const winnerVotes = winner === JAGUAR ? jaguar : raccoon;
  const setJustWon = !alreadyVoted && winnerVotes > 0 && winnerVotes % SET_POINTS === 0;

  const leader =
    jaguar === raccoon
      ? 'Empate por ahora'
      : jaguar > raccoon
        ? 'El Jaguar va ganando'
        : 'El Mapache va ganando';

  return (
    <Box className="sb" w="100%">
      <div className="sb-head">
        MARCADOR ADVCM · {sb.champion ? 'PARTIDO DEFINIDO' : `SET ${sb.setNo}`}
      </div>

      <div className="sb-row">
        <div className={`sb-side jaguar${sb.champion === 'jaguar' ? ' champ' : ''}`}>
          {sb.champion === 'jaguar' && (
            <div className="sb-crown">
              <IconCrown size={24} />
            </div>
          )}
          <img
            src={COPY[JAGUAR].img}
            alt="Jaguar"
            className="sb-logo"
            style={{ height: logoSize(jaguar, total, sb.setsJ) }}
          />
          <div className="sb-name">JAGUAR</div>
          <div className="sb-sets">
            SETS <b>{sb.setsJ}</b>
          </div>
        </div>

        <div className="sb-score">
          <span className="sb-digits jaguar">{sb.ptsJ}</span>
          <span className="sb-colon">:</span>
          <span className="sb-digits raccoon">{sb.ptsR}</span>
        </div>

        <div className={`sb-side raccoon${sb.champion === 'raccoon' ? ' champ' : ''}`}>
          {sb.champion === 'raccoon' && (
            <div className="sb-crown">
              <IconCrown size={24} />
            </div>
          )}
          <img
            src={COPY[RACCOON].img}
            alt="Mapache"
            className="sb-logo"
            style={{ height: logoSize(raccoon, total, sb.setsR) }}
          />
          <div className="sb-name">MAPACHE</div>
          <div className="sb-sets">
            SETS <b>{sb.setsR}</b>
          </div>
        </div>
      </div>

      {setJustWon && (
        <div className="sb-setwin">
          <IconBallVolleyball size={16} />
          ¡PUNTO DE SET! Tu voto le dio un set al {COPY[winner].name}
        </div>
      )}
      {sb.champion && (
        <div className="sb-setwin champ">
          <IconCrown size={16} />
          ¡El {COPY[sb.champion === 'jaguar' ? JAGUAR : RACCOON].name} ganó el partido (
          {SETS_TO_WIN} sets)!
        </div>
      )}

      <div className="sb-foot">
        {leader} · {total} votos · cada voto es un punto, set a {SET_POINTS}
      </div>
    </Box>
  );
}

export function ResultScreen({ winner, results, alreadyVoted }: Props) {
  const c = COPY[winner];

  return (
    <Stack align="center" gap="md" px="md" style={{ position: 'relative' }}>
      <Text c="gray.4" tt="uppercase" fw={700} fz="sm" lts={2}>
        Tu espíritu en la cancha
      </Text>

      <Box style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
        <div className="mascot-glow" />
        <img
          src={c.img}
          alt={c.name}
          className="mascot-img mascot-pop"
          style={{ height: 'clamp(150px, 42vw, 210px)', position: 'relative', zIndex: 1 }}
        />
      </Box>

      <Title
        order={1}
        ta="center"
        c="flame.4"
        style={{ fontSize: 'clamp(1.8rem, 8vw, 2.4rem)', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
      >
        {c.headline}
      </Title>

      <Text ta="center" size="md" c="gray.2">
        {c.body}
      </Text>

      {results ? (
        <Scoreboard results={results} winner={winner} alreadyVoted={alreadyVoted} />
      ) : (
        <Text size="sm" c="gray.5" ta="center">
          No se pudo cargar la votación general.
        </Text>
      )}

      {alreadyVoted && (
        <Text size="xs" c="gray.5" ta="center">
          Ya votaste con este dispositivo. ¡Gracias por participar!
        </Text>
      )}
    </Stack>
  );
}
