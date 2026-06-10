import { Stack, Title, Button, Progress, Text, Box } from '@mantine/core';
import type { Mascot, Question } from '../types';

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (mascot: Mascot) => void;
}

export function QuizScreen({ question, index, total, onAnswer }: Props) {
  const progress = (index / total) * 100;

  return (
    <Stack gap="xl" maw={520} mx="auto" px="md" w="100%">
      <Box>
        <Text size="sm" c="gray.5" mb={4} ta="center">
          Jugada {index + 1} de {total}
        </Text>
        <Progress value={progress} color="flame" size="md" radius="xl" transitionDuration={300} />
      </Box>

      {/* key forces a fresh mount → the entry animation replays each question */}
      <Box key={question.id} className="mascot-pop">
        <Title order={2} ta="center" c="gray.1" mb="xl">
          {question.prompt}
        </Title>

        <Stack gap="md">
          {question.answers.map((a, i) => (
            <Button
              key={i}
              size="lg"
              radius="lg"
              variant="light"
              color="flame"
              fullWidth
              h="auto"
              styles={{
                root: { paddingTop: 16, paddingBottom: 16 },
                label: { whiteSpace: 'normal', lineHeight: 1.3 },
              }}
              onClick={() => onAnswer(a.mascot)}
            >
              {a.label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
