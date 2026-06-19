import { useEffect, useState, type CSSProperties } from 'react';
import { Stack, Title, Text, Box, ActionIcon, Tooltip } from '@mantine/core';
import { IconBallVolleyball, IconCrown, IconHistory } from '@tabler/icons-react';
import { JAGUAR, RACCOON, type Mascot } from '../types';
import type { Results } from '../api';
import { getRemainingVotingTime, isVotingClosed, VOTING_DECISION_DATE } from '../votingDeadline';

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

const TEAM_KEY = {
  [JAGUAR]: 'jaguar',
  [RACCOON]: 'raccoon',
} as const;

const WINNER_ANIMATION = {
  [JAGUAR]: null,
  [RACCOON]: '/assets/winner-animation.html',
} as const;

const SET_POINTS = 25;

function twoDigits(value: number) {
  return String(value).padStart(2, '0');
}

function mascotVotes(results: Results, mascot: Mascot) {
  return mascot === JAGUAR ? results.jaguar : results.raccoon;
}

function finalWinner(results: Results): Mascot | null {
  if (results.jaguar === results.raccoon) return null;
  return results.jaguar > results.raccoon ? JAGUAR : RACCOON;
}

function FinalResultsPending() {
  return (
    <Stack align="center" gap="md" px="md" className="final-winner">
      <Text className="final-winner-kicker">Votación cerrada</Text>
      <Title order={1} ta="center" c="flame.4" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.4rem)' }}>
        Cargando ganador...
      </Title>
      <Text ta="center" size="sm" c="gray.4">
        Estamos leyendo los votos finales.
      </Text>
    </Stack>
  );
}

function FinalWinnerScreen({ results }: { results: Results }) {
  const winner = finalWinner(results);
  const total = results.total || results.jaguar + results.raccoon;

  if (winner === null) {
    return (
      <Stack align="center" gap="md" px="md" className="final-winner tie">
        <Text className="final-winner-kicker">Votación cerrada</Text>
        <Title order={1} ta="center" c="flame.4" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.4rem)' }}>
          Empate técnico
        </Title>
        <Text className="final-winner-total" ta="center">
          Total entre ambas mascotas: <b>{total}</b> votos
        </Text>
      </Stack>
    );
  }

  return <WinnerReveal results={results} winner={winner} total={total} />;
}

/**
 * Plays the winner intro animation (when one exists) and, once the iframe
 * signals it finished building the logo, swaps to the static webp + crown
 * and reveals the stats below. Teams without an animation reveal instantly.
 */
function WinnerReveal({ results, winner, total }: { results: Results; winner: Mascot; total: number }) {
  const c = COPY[winner];
  const teamKey = TEAM_KEY[winner];
  const votes = mascotVotes(results, winner);
  const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;
  const meterStyle = { '--winner-percent': `${percentage}%` } as CSSProperties;
  const animationSrc = WINNER_ANIMATION[winner];

  const [animationDone, setAnimationDone] = useState(animationSrc === null);

  useEffect(() => {
    if (animationSrc === null) return;
    const reveal = () => setAnimationDone(true);
    const onMessage = (event: MessageEvent) => {
      if (event.data === 'winner-animation-done') reveal();
    };
    window.addEventListener('message', onMessage);
    // Fallback: reveal anyway if the iframe never posts back.
    const fallback = window.setTimeout(reveal, 9000);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(fallback);
    };
  }, [animationSrc]);

  const showAnimation = animationSrc !== null && !animationDone;

  return (
    <Stack align="center" gap="md" px="md" className={`final-winner ${teamKey}`}>
      <Text className="final-winner-kicker">Mascota ganadora</Text>

      <div className={`final-winner-visual${showAnimation ? ' has-animation' : ''}`}>
        <div className="final-winner-burst" aria-hidden />
        {showAnimation ? (
          <iframe
            className="final-winner-animation"
            src={animationSrc}
            title={`Animación del ${c.name} ganador`}
            aria-label={`Animación del ${c.name} ganador`}
          />
        ) : (
          <div className="final-winner-logo-wrap">
            <div className="final-winner-crown" aria-hidden>
              <IconCrown size={52} />
            </div>
            <img src={c.img} alt={`${c.name} ganador`} className="final-winner-logo" />
          </div>
        )}
      </div>

      {!showAnimation && (
        <div className="winner-stats">
          <Title
            order={1}
            ta="center"
            c="flame.4"
            style={{ fontSize: 'clamp(1.9rem, 8vw, 2.6rem)', textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
          >
            Ganó el {c.name}
          </Title>

          <Text className="final-winner-total" ta="center">
            Total entre ambas mascotas: <b>{total}</b> votos
          </Text>

          <div
            className="winner-meter"
            aria-label={`El ${c.name} obtuvo ${votes} de ${total} votos, ${percentage} por ciento`}
          >
            <div className="winner-meter-track">
              <div className="winner-meter-fill" style={meterStyle}>
                <span>{percentage}%</span>
              </div>
            </div>
            <div className="winner-meter-votes">
              <b>{votes}</b>
              <span>votos exactos del {c.name}</span>
            </div>
          </div>
        </div>
      )}
    </Stack>
  );
}

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
  const [remaining, setRemaining] = useState(getRemainingVotingTime);
  const { jaguar, raccoon, total } = results;
  const sb = scoreboard(results);
  const setHistory = results.setHistory ?? [];
  const hasSetHistory = setHistory.length > 0;

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemainingVotingTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
  const setLeader = sb.setsJ === sb.setsR ? null : sb.setsJ > sb.setsR ? 'jaguar' : 'raccoon';

  return (
    <Box className="sb" w="100%">
      <div className="sb-head">
        MARCADOR ADVCM · SET {sb.setNo}
      </div>

      <div className="sb-row">
        <div className={`sb-side jaguar${setLeader === 'jaguar' ? ' champ' : ''}`}>
          {setLeader === 'jaguar' && (
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
            VOTOS REALES <b>{jaguar}</b>
          </div>
        </div>

        <div className="sb-score">
          <span className="sb-digits jaguar">{sb.ptsJ}</span>
          <span className="sb-colon">:</span>
          <span className="sb-digits raccoon">{sb.ptsR}</span>
        </div>

        <div className={`sb-side raccoon${setLeader === 'raccoon' ? ' champ' : ''}`}>
          {setLeader === 'raccoon' && (
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
      <div className="sb-countdown" aria-label="Tiempo restante para la decisión">
        <span>{remaining.finished ? 'Tiempo terminado' : 'Tiempo restante'}</span>
        <div className="sb-countdown-grid">
          <div>
            <b>{remaining.days}</b>
            <small>días</small>
          </div>
          <div>
            <b>{twoDigits(remaining.hours)}</b>
            <small>horas</small>
          </div>
          <div>
            <b>{twoDigits(remaining.minutes)}</b>
            <small>min</small>
          </div>
          <div>
            <b>{twoDigits(remaining.seconds)}</b>
            <small>seg</small>
          </div>
        </div>
      </div>
      <div className="sb-foot">
        {leader} · {total} votos acumulados · set actual reinicia cada {SET_POINTS} puntos · se decide el{' '}
        {VOTING_DECISION_DATE}
      </div>
    </Box>
  );
}

export function ResultScreen({ winner, results, alreadyVoted }: Props) {
  const [votingClosed, setVotingClosed] = useState(isVotingClosed);
  const c = COPY[winner];

  useEffect(() => {
    const timer = window.setInterval(() => setVotingClosed(isVotingClosed()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (votingClosed) {
    return results ? <FinalWinnerScreen results={results} /> : <FinalResultsPending />;
  }

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
