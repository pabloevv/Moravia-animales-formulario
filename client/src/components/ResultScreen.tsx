import { Stack, Title, Text, Image, Box, Paper, Progress, Group } from '@mantine/core';
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

function Standings({ results }: { results: Results }) {
  const { jaguar, raccoon, total } = results;
  const jPct = total ? Math.round((jaguar / total) * 100) : 50;
  const rPct = 100 - jPct;
  const leader =
    jaguar === raccoon ? 'empate' : jaguar > raccoon ? 'El Jaguar va ganando' : 'El Mapache va ganando';

  return (
    <Paper withBorder radius="lg" p="md" w="100%" bg="rgba(255,255,255,0.04)" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
      <Text ta="center" fw={800} c="flame.4" mb="xs">
        {leader}
      </Text>

      <Progress.Root size="xl" radius="xl">
        <Progress.Section value={jPct} color="flame">
          <Progress.Label>{jPct}%</Progress.Label>
        </Progress.Section>
        <Progress.Section value={rPct} color="court.4">
          <Progress.Label>{rPct}%</Progress.Label>
        </Progress.Section>
      </Progress.Root>

      <Group justify="space-between" mt={6}>
        <Text size="sm" c="flame.4" fw={700}>
          Jaguar {jaguar}
        </Text>
        <Text size="sm" c="gray.5">
          {total} votos
        </Text>
        <Text size="sm" c="court.3" fw={700}>
          Mapache {raccoon}
        </Text>
      </Group>
    </Paper>
  );
}

export function ResultScreen({ winner, results, alreadyVoted }: Props) {
  const c = COPY[winner];

  return (
    <Stack align="center" gap="lg" maw={520} mx="auto" px="md">
      <Text c="gray.5" tt="uppercase" fw={700} fz="sm" lts={2}>
        Tu espíritu en la cancha
      </Text>

      <Box className="mascot-pop">
        <Image src={c.img} alt={c.name} h={190} w="auto" fit="contain" />
      </Box>

      <Title order={1} ta="center" c="flame.4">
        {c.headline}
      </Title>

      <Text ta="center" size="md" c="gray.3">
        {c.body}
      </Text>

      {results ? (
        <Standings results={results} />
      ) : (
        <Text size="sm" c="gray.6" ta="center">
          No se pudo cargar la votación general.
        </Text>
      )}

      {alreadyVoted && (
        <Text size="xs" c="gray.6" ta="center">
          Ya votaste con este dispositivo. ¡Gracias por participar!
        </Text>
      )}
    </Stack>
  );
}
