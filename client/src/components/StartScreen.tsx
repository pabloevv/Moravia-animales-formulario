import { Stack, Title, Text, Button, Box, Image } from '@mantine/core';
import { Volleyball } from './Volleyball';

interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  return (
    <Stack align="center" gap="xl" maw={520} mx="auto" px="md">
      {/* ADVCM logo placeholder — swap freely. */}
      <Image
        src="/assets/advcm-logo.svg"
        alt="ADVCM"
        w={120}
        h="auto"
        fit="contain"
      />

      {/* Bouncing volleyball animation. */}
      <Box ta="center">
        <div className="vb-ball" aria-hidden>
          <Volleyball size={130} variant={1} />
        </div>
        <div className="vb-ball-shadow" aria-hidden />
      </Box>

      <Title order={1} ta="center" c="flame.4">
        ¡Descubre tu mascota!
      </Title>

      <Text ta="center" size="lg" c="gray.3">
        Jaguar o Mapache. La cancha decide quién eres.
      </Text>

      <Button
        size="xl"
        radius="xl"
        fullWidth
        color="flame"
        onClick={onStart}
      >
        ¡Empezar!
      </Button>
    </Stack>
  );
}
