import { Stack, Title, Text, Button, Box } from '@mantine/core';
import { Volleyball } from './Volleyball';

interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  return (
    <Stack align="center" gap="xl" px="lg">
      {/* ADVCM logo — transparent SVG. ?v=2 busts cache after the logo swap. */}
      <img
        src="/assets/advcm-logo.svg?v=2"
        alt="ADVCM Moravia"
        style={{
          height: 110,
          width: 'auto',
          display: 'block',
          filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.55))',
        }}
      />

      {/* Bouncing volleyball (20.svg). */}
      <Box ta="center" mt="xs">
        <div className="vb-ball" aria-hidden>
          <Volleyball size={140} />
        </div>
        <div className="vb-ball-shadow" aria-hidden />
      </Box>

      <Stack align="center" gap={6}>
        <Title
          order={1}
          ta="center"
          c="white"
          style={{ fontSize: 'clamp(1.9rem, 8vw, 2.6rem)', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          ¡Descubre tu mascota!
        </Title>
        <Text ta="center" c="gray.3" style={{ fontSize: 'clamp(0.95rem, 4vw, 1.15rem)' }}>
          Jaguar o Mapache. La cancha decide quién eres.
        </Text>
      </Stack>

      <Button
        className="cta-pulse"
        size="xl"
        radius="xl"
        fullWidth
        color="flame"
        onClick={onStart}
        styles={{ root: { maxWidth: 420 } }}
      >
        ¡Empezar!
      </Button>
    </Stack>
  );
}
