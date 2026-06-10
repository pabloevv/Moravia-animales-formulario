import { Stack, Title, Text, Button, Group, Image, Paper, Box } from '@mantine/core';

interface Props {
  onBegin: () => void;
}

function MascotCard({ src, name, tagline }: { src: string; name: string; tagline: string }) {
  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      bg="rgba(255,255,255,0.04)"
      style={{ flex: 1, borderColor: 'rgba(255,255,255,0.12)' }}
    >
      <Stack align="center" gap={6}>
        <Image src={src} alt={name} h={120} w="auto" fit="contain" />
        <Text fw={800} size="lg" c="flame.4">
          {name}
        </Text>
        <Text size="sm" ta="center" c="gray.4">
          {tagline}
        </Text>
      </Stack>
    </Paper>
  );
}

export function IntroScreen({ onBegin }: Props) {
  return (
    <Stack align="center" gap="lg" maw={560} mx="auto" px="md">
      <Title order={2} ta="center" c="gray.1">
        Dos espíritus. Una cancha.
      </Title>

      <Group align="stretch" gap="sm" wrap="nowrap" w="100%">
        <MascotCard
          src="/assets/jaguar-dark.webp"
          name="Jaguar"
          tagline="Poder explosivo · fuerza · liderazgo feroz"
        />
        <MascotCard
          src="/assets/raccoon-dark.webp"
          name="Mapache"
          tagline="Inteligencia táctica · adaptabilidad · resiliencia"
        />
      </Group>

      <Box>
        <Text ta="center" size="md" c="gray.3">
          No vas a elegir solo tu animal favorito. Tus decisiones en la cancha
          van a revelar cuál de los dos representa de verdad tu espíritu.
        </Text>
      </Box>

      <Button size="lg" radius="xl" fullWidth color="flame" onClick={onBegin}>
        Comenzar el reto
      </Button>
    </Stack>
  );
}
