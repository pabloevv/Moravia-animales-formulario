import { useState } from 'react';
import {
  Stack,
  Title,
  Text,
  SimpleGrid,
  Box,
  UnstyledButton,
  Modal,
  Button,
  Group,
  Badge,
} from '@mantine/core';
import { type Mascot } from '../types';
import { MASCOTS } from '../data/mascots';

interface Props {
  onChoose: (team: Mascot) => void;
}

type Key = 'jaguar' | 'raccoon';

function ChoiceCard({ infoKey, onOpen }: { infoKey: Key; onOpen: (k: Key) => void }) {
  const info = MASCOTS[infoKey];
  return (
    <UnstyledButton onClick={() => onOpen(infoKey)} className="choice-card glass" data-team={infoKey}>
      <Stack align="center" gap={6} p="md">
        <img src={info.img} alt={info.name} className="mascot-img" style={{ height: 'clamp(96px, 30vw, 140px)' }} />
        <Text fw={900} fz="xl" c="flame.4">
          {info.name}
        </Text>
        <Box className="choice-pick">Elegir</Box>
      </Stack>
    </UnstyledButton>
  );
}

export function ChooseScreen({ onChoose }: Props) {
  const [preview, setPreview] = useState<Key | null>(null);
  const info = preview ? MASCOTS[preview] : null;

  return (
    <Stack align="center" gap="lg" px="md">
      <Title order={1} ta="center" c="white" style={{ fontSize: 'clamp(1.7rem, 7vw, 2.2rem)', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
        Elige tu mascota
      </Title>
      <Text ta="center" fz="sm" c="gray.2">
        ¿Con cuál te identificás? Tocá una carta para conocerla y confirmar tu voto.
      </Text>

      <SimpleGrid cols={2} spacing="sm" w="100%">
        <ChoiceCard infoKey="jaguar" onOpen={setPreview} />
        <ChoiceCard infoKey="raccoon" onOpen={setPreview} />
      </SimpleGrid>

      <Text fz="xs" c="gray.5" ta="center">
        Solo podés votar una vez.
      </Text>

      {/* Preview + confirm modal. X (top-right) closes to pick another card. */}
      <Modal
        opened={info !== null}
        onClose={() => setPreview(null)}
        centered
        radius="lg"
        size="sm"
        withCloseButton
        overlayProps={{ backgroundOpacity: 0.6, blur: 3 }}
        title={
          <Text fw={900} fz="lg" c="flame.4">
            {info?.name}
          </Text>
        }
        styles={{
          content: { background: 'rgba(13,18,30,0.97)' },
          header: { background: 'transparent' },
        }}
      >
        {info && (
          <Stack align="center" gap="md">
            <img src={info.img} alt={info.name} className="mascot-img" style={{ height: 'clamp(120px, 34vw, 170px)' }} />

            <Text ta="center" fz="sm" c="gray.2">
              {info.intro}
            </Text>

            <Group gap={6} justify="center">
              {info.positions.map((p) => (
                <Badge key={p.zone} variant="light" color="flame" radius="sm">
                  {p.value}
                </Badge>
              ))}
            </Group>

            <Button
              fullWidth
              size="lg"
              radius="xl"
              color="flame"
              className="cta-pulse"
              onClick={() => onChoose(info.team)}
            >
              Votar por el {info.name}
            </Button>
            <Text fz="xs" c="gray.6" ta="center">
              ¿No es la tuya? Cerrá con la X y elegí la otra.
            </Text>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
