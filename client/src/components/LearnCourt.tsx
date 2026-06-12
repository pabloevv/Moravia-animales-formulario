import { useRef, useState } from 'react';
import { Stack, Title, Text, Button, SegmentedControl, Modal, Group, Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBallVolleyball,
  IconConfetti,
  IconDeviceGamepad2,
  IconLockFilled,
  IconStarFilled,
} from '@tabler/icons-react';
import { RACCOON, JAGUAR } from '../types';
import { MASCOTS } from '../data/mascots';
import { Court3D } from './Court3D';

interface Props {
  onContinue: () => void;
}

type TeamKey = 'jaguar' | 'raccoon';
const ZONES_PER_TEAM = 6;
const TOTAL_ZONES = ZONES_PER_TEAM * 2;

/** Six progress pips for one team's discovered zones. */
function TeamPips({ team, count }: { team: TeamKey; count: number }) {
  return (
    <div className={`hud-pips ${team}`}>
      <span className="hud-pips-name">{MASCOTS[team].name}</span>
      {Array.from({ length: ZONES_PER_TEAM }, (_, i) => (
        <i key={i} className={`hud-pip${i < count ? ' on' : ''}`} />
      ))}
    </div>
  );
}

/**
 * "Videogame" learn stage: every court zone starts as a mystery "?" tile.
 * Tapping one reveals its value (modal with the full story) and earns a star.
 * Completing a side auto-orbits the camera to the other team; only after all
 * 12 discoveries does the "choose your mascot" button unlock.
 */
export function LearnCourt({ onContinue }: Props) {
  const [flipped, setFlipped] = useState(false); // false = Jaguar faces you
  const [zone, setZone] = useState<number | null>(null); // tapped zone → modal
  const [seen, setSeen] = useState<{ jaguar: Set<number>; raccoon: Set<number> }>({
    jaguar: new Set(),
    raccoon: new Set(),
  });
  const [banner, setBanner] = useState<{ kind: 'side' | 'all'; text: string } | null>(null);
  const bannerTimer = useRef<number | undefined>(undefined);
  const celebrated = useRef<Set<string>>(new Set()); // side-complete shown once
  const isMobile = useMediaQuery('(max-width: 480px)');

  const activeKey: TeamKey = flipped ? 'raccoon' : 'jaguar';
  const active = MASCOTS[activeKey];
  const selected = zone !== null ? active.positions.find((p) => p.zone === zone) ?? null : null;

  const discovered = seen.jaguar.size + seen.raccoon.size;
  const allDone = discovered === TOTAL_ZONES;

  const showBanner = (kind: 'side' | 'all', text: string) => {
    setBanner({ kind, text });
    window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBanner(null), 2800);
  };

  // Rotate the court to a side, closing any open explanation.
  const flipTo = (toRaccoon: boolean) => {
    setFlipped(toRaccoon);
    setZone(null);
  };

  // Tap a zone: open its story and mark it discovered.
  const openZone = (z: number) => {
    setZone(z);
    setSeen((prev) =>
      prev[activeKey].has(z)
        ? prev
        : { ...prev, [activeKey]: new Set(prev[activeKey]).add(z) },
    );
  };

  // Closing the story: celebrate side/mission completion and auto-orbit.
  const closeZone = () => {
    setZone(null);
    const mine = seen[activeKey].size;
    const otherKey: TeamKey = activeKey === 'jaguar' ? 'raccoon' : 'jaguar';
    const others = seen[otherKey].size;

    if (mine === ZONES_PER_TEAM && !celebrated.current.has(activeKey)) {
      celebrated.current.add(activeKey);
      if (others < ZONES_PER_TEAM) {
        showBanner('side', `¡Lado ${active.name} completado! Giramos al ${MASCOTS[otherKey].name}`);
        window.setTimeout(() => flipTo(!flipped), 650);
        return;
      }
    }
    if (mine === ZONES_PER_TEAM && others === ZONES_PER_TEAM && !celebrated.current.has('all')) {
      celebrated.current.add('all');
      showBanner('all', '¡Misión completa! Ya podés elegir tu mascota');
    }
  };

  return (
    <Stack align="center" gap="md" px="md">
      <Title order={2} ta="center" c="white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        Conocé a las mascotas
      </Title>

      {/* Mission HUD */}
      <div className="hud glass">
        <div className="hud-top">
          <Badge
            color="flame"
            variant="filled"
            radius="sm"
            leftSection={<IconDeviceGamepad2 size={13} />}
          >
            Misión
          </Badge>
          <Text fz="sm" fw={700} c="gray.1">
            Descubrí las 12 zonas de la cancha
          </Text>
          <span className="hud-count">
            <IconStarFilled size={13} />
            {discovered}/{TOTAL_ZONES}
          </span>
        </div>
        <div className="hud-bars">
          <TeamPips team="jaguar" count={seen.jaguar.size} />
          <TeamPips team="raccoon" count={seen.raccoon.size} />
        </div>
      </div>

      {/* Selecting a side rotates the whole court to that team. */}
      <SegmentedControl
        value={String(flipped ? RACCOON : JAGUAR)}
        onChange={(v) => flipTo(Number(v) === RACCOON)}
        color="flame"
        radius="xl"
        fullWidth
        data={[
          { label: 'Jaguar', value: String(JAGUAR) },
          { label: 'Mapache', value: String(RACCOON) },
        ]}
        styles={{ root: { maxWidth: 320, width: '100%' } }}
      />

      <div className="court-wrap">
        <Court3D flipped={flipped} zone={zone} seen={seen} onZone={openZone} onFlip={() => flipTo(!flipped)} />
        {banner && (
          <div className="vb3-banner">
            {banner.kind === 'all' ? <IconConfetti size={18} /> : <IconBallVolleyball size={18} />}
            <span>{banner.text}</span>
          </div>
        )}
      </div>

      <Text fz="xs" c="gray.5" ta="center">
        Tocá las casillas con «?» para desbloquear los valores de cada mascota.
      </Text>

      <Button
        className={allDone ? 'cta-pulse' : undefined}
        size="lg"
        radius="xl"
        fullWidth
        color="flame"
        disabled={!allDone}
        onClick={onContinue}
        leftSection={allDone ? <IconDeviceGamepad2 size={20} /> : <IconLockFilled size={18} />}
        styles={{ root: { maxWidth: 420 } }}
      >
        {allDone ? '¡Elegir mi mascota!' : `Desbloqueá las zonas · ${discovered}/${TOTAL_ZONES}`}
      </Button>

      {/* Broad explanation opens as a modal that fills the screen on mobile. */}
      <Modal
        opened={selected !== null}
        onClose={closeZone}
        centered
        fullScreen={isMobile}
        size="lg"
        radius={isMobile ? 0 : 'lg'}
        withCloseButton
        overlayProps={{ backgroundOpacity: 0.7, blur: 5 }}
        title={
          selected && (
            <Group gap="xs">
              <Badge color="flame" variant="filled" radius="sm">
                Zona {selected.zone}
              </Badge>
              <Text fw={900} fz="lg" c="flame.4">
                {active.name} · {selected.value}
              </Text>
              <Badge
                color="yellow"
                variant="light"
                radius="sm"
                leftSection={<IconStarFilled size={10} />}
              >
                ¡Desbloqueada!
              </Badge>
            </Group>
          )
        }
        styles={{
          content: { background: 'rgba(13,18,30,0.98)' },
          header: { background: 'transparent' },
          title: { width: '100%' },
        }}
      >
        {selected && (
          <Stack
            align="center"
            gap="lg"
            py="md"
            style={{ minHeight: isMobile ? '72vh' : undefined, justifyContent: 'center' }}
          >
            <img
              src={active.img}
              alt={active.name}
              className="mascot-img"
              style={{ height: 'clamp(120px, 36vw, 180px)' }}
            />
            <Text fz="md" c="gray.1" ta="center" style={{ lineHeight: 1.6, maxWidth: 520 }}>
              {selected.long}
            </Text>
            <Button radius="xl" color="flame" onClick={closeZone}>
              ¡Entendido! Seguir explorando
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
