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
 * The API returns the live set score because both sides reset together when
 * one team reaches 25. The fallback keeps older API responses readable.
 */
function scoreboard(r: Results) {
  const setsJ = r.sets?.jaguar ?? Math.floor(r.jaguar / SET_POINTS);
  const setsR = r.sets?.raccoon ?? Math.floor(r.raccoon / SET_POINTS);
  const champion =
    setsJ >= SETS_TO_WIN && setsJ > setsR
      ? ('jaguar' as const)
      : setsR >= SETS_TO_WIN && setsR > setsJ
        ? ('raccoon' as const)
        : null;
  return {
    ptsJ: r.setScore?.jaguar ?? r.jaguar % SET_POINTS,
    ptsR: r.setScore?.raccoon ?? r.raccoon % SET_POINTS,
    setsJ,
    setsR,
    setNo: setsJ + setsR + 1,
    champion,
  };
}

function Scoreboard({ results, winner, alreadyVoted }: { results: Results; winner: Mascot; alreadyVoted: boolean }) {
  const { jaguar, raccoon, total } = results;
  const sb = scoreboard(results);

  const setJustWon =
    !alreadyVoted &&
    results.counted === true &&
    results.setWinner === (winner === JAGUAR ? 'jaguar' : 'raccoon');

  const leader =
    sb.setsJ === sb.setsR
      ? 'Sets empatados por ahora'
      : sb.setsJ > sb.setsR
        ? 'El Jaguar va ganando en sets'
        : 'El Mapache va ganando en sets';

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
          <img src={COPY[JAGUAR].img} alt="Jaguar" className="sb-logo" />
          <div className="sb-name">JAGUAR</div>
          <div className="sb-sets">
            SETS <b>{sb.setsJ}</b>
          </div>
          <div className="sb-total">
            PUNTOS <b>{jaguar}</b>
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
          <img src={COPY[RACCOON].img} alt="Mapache" className="sb-logo" />
          <div className="sb-name">MAPACHE</div>
          <div className="sb-sets">
            SETS <b>{sb.setsR}</b>
          </div>
          <div className="sb-total">
            PUNTOS <b>{raccoon}</b>
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
        {leader} · {total} votos totales · marcador reinicia cada {SET_POINTS} puntos
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
