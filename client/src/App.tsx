import { useEffect, useMemo, useRef, useState } from 'react';
import { Center, Box } from '@mantine/core';
import { JAGUAR, type Mascot, type Stage } from './types';
import { submitVote, fetchResults, type Results } from './api';
import { getDeviceId, getPriorVote, markVoted } from './device';
import { StartScreen } from './components/StartScreen';
import { LearnCourt } from './components/LearnCourt';
import { ChooseScreen } from './components/ChooseScreen';
import { ResultScreen } from './components/ResultScreen';
import { Confetti } from './components/Confetti';

export default function App() {
  const prior = useRef(getPriorVote());

  const [stage, setStage] = useState<Stage>(prior.current === null ? 'start' : 'result');
  const [winner, setWinner] = useState<Mascot>(prior.current ?? JAGUAR);
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    if (prior.current !== null) fetchResults().then(setResults);
  }, []);

  function handleChoose(team: Mascot) {
    setWinner(team);
    markVoted(team);
    submitVote(team, getDeviceId()).then(setResults); // silent POST → standings
    setStage('result');
  }

  const content = useMemo(() => {
    switch (stage) {
      case 'start':
        return <StartScreen onStart={() => setStage('learn')} />;
      case 'learn':
        return <LearnCourt onContinue={() => setStage('choose')} />;
      case 'choose':
        return <ChooseScreen onChoose={handleChoose} />;
      case 'result':
        return <ResultScreen winner={winner} results={results} alreadyVoted={prior.current !== null} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, winner, results]);

  return (
    <>
      <div className="app-bg" aria-hidden />
      <div className="app-bg-overlay" aria-hidden />
      {stage === 'result' && prior.current === null && <Confetti />}
      <Center mih="100dvh" py="xl" style={{ position: 'relative', zIndex: 1 }}>
        <Box key={stage} className="stage-in" w="100%" maw={460} mx="auto">
          {content}
        </Box>
      </Center>
    </>
  );
}
