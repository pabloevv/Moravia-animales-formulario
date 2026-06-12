import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { IconRotate, IconStarFilled } from '@tabler/icons-react';
import { MASCOTS } from '../data/mascots';
import { JAGUAR, type MascotInfo } from '../types';
import { CourtPlay } from './CourtPlay';

interface Props {
  flipped: boolean; // false = camera on Jaguar's side, true = on Mapache's side
  zone: number | null;
  /** Zones already discovered per team (game progress) — others show as "?" */
  seen: { jaguar: ReadonlySet<number>; raccoon: ReadonlySet<number> };
  onZone: (z: number) => void;
  onFlip: () => void;
}

const cls = (m: MascotInfo) => (m.team === JAGUAR ? 'jaguar' : 'raccoon');

/**
 * One half of the court, painted flat on the 3D floor.
 *
 * The top half belongs to Mapache and is statically rotated 180° in-plane
 * (CSS `.vb3-half.top`), exactly like a real court where each team's markings
 * face its own baseline. `.vb3-tile-in` counter-rotates the label text of
 * whichever half is far so it always reads upright for the camera.
 */
function CourtHalf({
  side,
  info,
  isFar,
  zone,
  seenZones,
  onZone,
  onFlip,
}: {
  side: 'top' | 'bottom';
  info: MascotInfo;
  isFar: boolean;
  zone: number | null;
  seenZones: ReadonlySet<number>;
  onZone: (z: number) => void;
  onFlip: () => void;
}) {
  return (
    <div className={`vb3-half ${side} ${cls(info)}`} data-far={isFar || undefined}>
      <div className="vb3-zones">
        {info.positions.map((p) => {
          const revealed = seenZones.has(p.zone);
          return (
            <button
              key={p.zone}
              type="button"
              className={`vb3-tile${!isFar && p.zone === zone ? ' active' : ''}${revealed ? '' : ' mystery'}`}
              onClick={() => onZone(p.zone)}
              disabled={isFar}
              tabIndex={isFar ? -1 : 0}
            >
              <span className="vb3-tile-in">
                <span className="vb3-tile-zone">{p.zone}</span>
                {revealed ? (
                  <span className="vb3-tile-val">{p.value}</span>
                ) : (
                  <span className="vb3-tile-q">?</span>
                )}
              </span>
              {revealed && (
                <span className="vb3-tile-star">
                  <IconStarFilled size={11} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* Far half acts as one big "orbit over there" tap target. */}
      <button
        type="button"
        className="vb3-half-flip"
        onClick={onFlip}
        disabled={!isFar}
        tabIndex={isFar ? 0 : -1}
        aria-label={`Girar la cancha al lado de ${info.name}`}
      />
    </div>
  );
}

/**
 * True 3D volleyball diorama.
 *
 * The scene is split into two sibling "worlds" that share the exact same 3D
 * transform (tilt + orbit):
 *
 *  - `.vb3-world.floor-world` — the INTERACTIVE court floor. It is a single
 *    flat transformed plane (no preserve-3d inside), which is the one 3D
 *    arrangement where Chromium hit-testing is fully reliable. All buttons
 *    (zone tiles, far-half flip, baseline chips) live here.
 *  - `.vb3-world.deco-world` — preserve-3d scenery: the standing net and the
 *    Haikyuu-style rally. Entirely pointer-events:none so its intersecting
 *    3D planes can never eat a tap.
 *
 * Switching sides spins both worlds 180° around the floor normal — the
 * camera orbits from one team's sector to the other, passing around the net.
 * The orbit is driven by one registered custom property (`--spin`)
 * transitioned on the stage; billboarded sprites counter-rotate by the same
 * amount in perfect sync. Browsers without @property snap sides instantly.
 */
export function Court3D({ flipped, zone, seen, onZone, onFlip }: Props) {
  // Accumulate +180° per switch so the camera always orbits the same way
  // around the court instead of swinging back.
  const [angle, setAngle] = useState(flipped ? 180 : 0);
  const prev = useRef(flipped);

  useEffect(() => {
    if (prev.current === flipped) return;
    prev.current = flipped;
    setAngle((a) => a + 180);
  }, [flipped]);

  return (
    <div className="vb3-stage" style={{ '--spin': `${angle}deg` } as CSSProperties}>
      <div className="vb3-shake">
        {/* INTERACTIVE flat world: floor, tiles, labels, baseline chips */}
        <div className="vb3-world floor-world">
          <div className="vb3-floor">
            <i className="vb3-line-attack a" aria-hidden />
            <i className="vb3-line-attack b" aria-hidden />
            <i className="vb3-line-center" aria-hidden />
            <CourtHalf
              side="top"
              info={MASCOTS.raccoon}
              isFar={!flipped}
              zone={zone}
              seenZones={seen.raccoon}
              onZone={onZone}
              onFlip={onFlip}
            />
            <CourtHalf
              side="bottom"
              info={MASCOTS.jaguar}
              isFar={flipped}
              zone={zone}
              seenZones={seen.jaguar}
              onZone={onZone}
              onFlip={onFlip}
            />
          </div>

          {/* Painted team names just beyond each baseline (readable when near) */}
          <div className={`vb3-floor-label top${flipped ? '' : ' hide'}`} aria-hidden>
            {MASCOTS.raccoon.name}
          </div>
          <div className={`vb3-floor-label bottom${flipped ? ' hide' : ''}`} aria-hidden>
            {MASCOTS.jaguar.name}
          </div>

          {/* "Orbit to the far side" chips painted on the floor past each
              baseline. The top chip is only shown (and readable) from the
              Jaguar side; the bottom one, from the Mapache side. */}
          <div className={`vb3-chipwrap top${flipped ? ' hide' : ''}`}>
            <button type="button" className="vb3-chip" onClick={onFlip} tabIndex={flipped ? -1 : 0}>
              <IconRotate size={14} />
              Ver lado {MASCOTS.raccoon.name}
            </button>
          </div>
          <div className={`vb3-chipwrap bottom${flipped ? '' : ' hide'}`}>
            <button type="button" className="vb3-chip" onClick={onFlip} tabIndex={flipped ? 0 : -1}>
              <IconRotate size={14} />
              Ver lado {MASCOTS.jaguar.name}
            </button>
          </div>
        </div>

        {/* DECORATIVE preserve-3d world: standing net + the rally */}
        <div className="vb3-world deco-world" aria-hidden>
          <div className="vb3-net">
            <i className="vb3-net-post l" />
            <i className="vb3-net-post r" />
            <i className="vb3-net-mesh" />
            <i className="vb3-net-band" />
            <i className="vb3-net-antenna l" />
            <i className="vb3-net-antenna r" />
          </div>
          <CourtPlay />
        </div>
      </div>
    </div>
  );
}
