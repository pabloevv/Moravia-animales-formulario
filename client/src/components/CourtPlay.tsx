/**
 * Looping Haikyuu-style rally, fixed to the Mapache (top) half of the 3D world.
 *
 * Pure CSS keyframes on a shared 6.5s cycle (see index.css):
 *   ball drops in → setter sets → spiker approaches, leaps and SPIKES →
 *   impact flash + radial speed lines + light-trail beam → ball slams the
 *   Jaguar half (dust rings, court shake) → bounces away → reset pause.
 *
 * Geometry: every `.vb3-prop` is a box whose bottom-center sits on a floor
 * point (world coords, 340×520 court). The `.vb3-bb` inside stands it upright
 * and billboards it against the orbit (counter-rotates `--spin`), so the play
 * reads from BOTH sides of the court: watching from the Jaguar side the spike
 * flies toward the camera; from the Mapache side it flies away. The beam and
 * dust rings are world-fixed so the trajectory stays physically consistent.
 *
 * Everything is decorative: aria-hidden, pointer-events none.
 */
export function CourtPlay() {
  return (
    <div className="vb3-play" aria-hidden>
      {/* Setter (Mapache #2), planted by the net */}
      <div className="vb3-prop plr-track setter-track">
        <div className="vb3-bb">
          <div className="plr setter">
            <div className="plr-jump">
              <div className="plr-body">
                <span className="plr-arm l" />
                <span className="plr-leg l" />
                <span className="plr-leg r" />
                <span className="plr-torso" />
                <span className="plr-head" />
                <span className="plr-arm r" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spiker (Mapache #10): approach run → jump → spike */}
      <div className="vb3-prop plr-track spiker-track">
        <div className="vb3-bb">
          <div className="plr spiker">
            <div className="plr-jump">
              <div className="plr-body">
                <span className="plr-arm l" />
                <span className="plr-leg l" />
                <span className="plr-leg r" />
                <span className="plr-torso" />
                <span className="plr-head" />
                <span className="plr-arm r" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ball shadow, flat on the floor (sells the height of the arc) */}
      <div className="vb3-prop ball-shadow-track">
        <i className="vb3-ball-shadow" />
      </div>

      {/* The ball: floor track → standing billboard → vertical lift → sphere */}
      <div className="vb3-prop ball-track">
        <div className="vb3-bb">
          <div className="vb3-ball-lift">
            <i className="vb3-ball" />
          </div>
        </div>
      </div>

      {/* Impact flash (star burst) at the contact point */}
      <div className="vb3-prop fx-flash-prop">
        <div className="vb3-bb">
          <div className="fx-lift-flash">
            <i className="fx-flash" />
          </div>
        </div>
      </div>

      {/* Radial anime speed lines at the contact point */}
      <div className="vb3-prop fx-burst-prop">
        <div className="vb3-bb">
          <div className="fx-lift-burst">
            <i className="fx-burst" />
          </div>
        </div>
      </div>

      {/* Light-trail beam along the spike trajectory (world-fixed 3D) */}
      <i className="fx-beam" />

      {/* Dust rings where the ball slams the floor */}
      <i className="fx-ring r1" />
      <i className="fx-ring r2" />
    </div>
  );
}
