import { useState } from 'react';
import { Stack, Title, Text, Box, ActionIcon, Tooltip } from '@mantine/core';
import { IconBallVolleyball, IconHistory } from '@tabler/icons-react';
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
const DECISION_DATE = 'viernes 19 de junio';

/**
 * The API returns the live set score because both sides reset together when
 * one team reaches 25. The fallback keeps older API responses readable.
 */
function scoreboard(r: Results) {
  const setsJ = r.sets?.jaguar ?? Math.floor(r.jaguar / SET_POINTS);
  const setsR = r.sets?.raccoon ?? Math.floor(r.raccoon / SET_POINTS);
  return {
    ptsJ: r.setScore?.jaguar ?? r.jaguar % SET_POINTS,
    ptsR: r.setScore?.raccoon ?? r.raccoon % SET_POINTS,
    setsJ,
    setsR,
    setNo: setsJ + setsR + 1,
  };
}

function Scoreboard({ results, winner, alreadyVoted }: { results: Results; winner: Mascot; alreadyVoted: boolean }) {
  const [showHistory, setShowHistory] = useState(false);
  const { jaguar, raccoon, total } = results;
  const sb = scoreboard(results);
  const setHistory = results.setHistory ?? [];
  const hasSetHistory = setHistory.length > 0;

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
        MARCADOR ADVCM · SET {sb.setNo}
      </div>

      <div className="sb-row">
        <div className="sb-side jaguar">
          <img src={COPY[JAGUAR].img} alt="Jaguar" className="sb-logo" />
          <div className="sb-name">JAGUAR</div>
          <div className="sb-sets">
            SETS <b>{sb.setsJ}</b>
          </div>
          <div className="sb-total">
            VOTOS REALES <b>{jaguar}</b>
          </div>
        </div>

        <div className="sb-score">
          <span className="sb-digits jaguar">{sb.ptsJ}</span>
          <span className="sb-colon">:</span>
          <span className="sb-digits raccoon">{sb.ptsR}</span>
        </div>

        <div className="sb-side raccoon">
          <img src={COPY[RACCOON].img} alt="Mapache" className="sb-logo" />
          <div className="sb-name">MAPACHE</div>
          <div className="sb-sets">
            SETS <b>{sb.setsR}</b>
          </div>
          <div className="sb-total">
            VOTOS REALES <b>{raccoon}</b>
          </div>
        </div>
      </div>

      {hasSetHistory && (
        <div className="sb-history-toggle">
          <Tooltip label={showHistory ? 'Ocultar sets anteriores' : 'Ver sets anteriores'}>
            <ActionIcon
              className={`sb-history-button${showHistory ? ' active' : ''}`}
              variant="subtle"
              radius="xl"
              size="lg"
              color="gray"
              aria-label={showHistory ? 'Ocultar sets anteriores' : 'Ver sets anteriores'}
              aria-expanded={showHistory}
              onClick={() => setShowHistory((value) => !value)}
            >
              <IconHistory size={19} />
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      {hasSetHistory && showHistory && (
        <div className="sb-history">
          <div className="sb-history-title">SETS ANTERIORES</div>
          <div className="sb-history-list">
            {setHistory.map((set) => (
              <div key={set.set} className={`sb-history-item ${set.winner}`}>
                <span>SET {set.set}</span>
                <b>{set.jaguar}</b>
                <span>:</span>
                <b>{set.raccoon}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {setJustWon && (
        <div className="sb-setwin">
          <IconBallVolleyball size={16} />
          ¡PUNTO DE SET! Tu voto le dio un set al {COPY[winner].name}
        </div>
      )}
      <div className="sb-foot">
        {leader} · {total} votos acumulados · set actual reinicia cada {SET_POINTS} puntos · se decide el{' '}
        {DECISION_DATE}
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
