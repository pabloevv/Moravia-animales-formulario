import { useEffect, useMemo, useRef, useState } from 'react';
import { Center, Box } from '@mantine/core';
import { JAGUAR, RACCOON, type Mascot, type Stage } from './types';
import { questions } from './data/questions';
import { submitVote, fetchResults, type Results } from './api';
import { getDeviceId, getPriorVote, markVoted } from './device';
import { Court } from './components/Court';
import { VolleyballBackground } from './components/VolleyballBackground';
import { StartScreen } from './components/StartScreen';
import { IntroScreen } from './components/IntroScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  // If this device already voted, jump straight to the result (no retake).
  const prior = useRef(getPriorVote());

  const [stage, setStage] = useState<Stage>(prior.current === null ? 'start' : 'result');
  const [index, setIndex] = useState(0);
  const [jaguarPoints, setJaguarPoints] = useState(0);
  const [raccoonPoints, setRaccoonPoints] = useState(0);
  const [winner, setWinner] = useState<Mascot>(prior.current ?? JAGUAR);
  const [results, setResults] = useState<Results | null>(null);

  // Returning voter: load the current standings to show their saved result.
  useEffect(() => {
    if (prior.current !== null) fetchResults().then(setResults);
  }, []);

  function handleAnswer(mascot: Mascot) {
    const nextJaguar = jaguarPoints + (mascot === JAGUAR ? 1 : 0);
    const nextRaccoon = raccoonPoints + (mascot === RACCOON ? 1 : 0);
    setJaguarPoints(nextJaguar);
    setRaccoonPoints(nextRaccoon);

    const isLast = index + 1 >= questions.length;
    if (isLast) {
      const result: Mascot = nextRaccoon > nextJaguar ? RACCOON : JAGUAR;
      setWinner(result);
      markVoted(result); // lock this device locally
      submitVote(result, getDeviceId()).then(setResults); // silent POST → standings
      setStage('result');
    } else {
      setIndex((i) => i + 1);
    }
  }

  const content = useMemo(() => {
    switch (stage) {
      case 'start':
        return <StartScreen onStart={() => setStage('intro')} />;
      case 'intro':
        return <IntroScreen onBegin={() => setStage('quiz')} />;
      case 'quiz':
        return (
          <QuizScreen
            question={questions[index]}
            index={index}
            total={questions.length}
            onAnswer={handleAnswer}
          />
        );
      case 'result':
        return (
          <ResultScreen
            winner={winner}
            results={results}
            alreadyVoted={prior.current !== null}
          />
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, index, winner, results]);

  return (
    <>
      <Court />
      <VolleyballBackground />
      <Center mih="100dvh" py="xl" style={{ position: 'relative', zIndex: 1 }}>
        <Box key={stage} className="stage-in" w="100%">
          {content}
        </Box>
      </Center>
    </>
  );
}
