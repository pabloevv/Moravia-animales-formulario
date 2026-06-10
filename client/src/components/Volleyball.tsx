interface Props {
  /** Rendered height in px (width follows the art's aspect ratio). */
  size?: number;
  /** Which volleyball art: 1 = volleyball-1.svg, 2 = volleyball-2.svg. */
  variant?: 1 | 2;
  className?: string;
}

const SRC: Record<1 | 2, string> = {
  1: '/assets/volleyball-1.svg',
  2: '/assets/volleyball-2.svg',
};

/** Volleyball graphic from the provided SVG art. */
export function Volleyball({ size = 96, variant = 1, className }: Props) {
  return (
    <img
      src={SRC[variant]}
      alt=""
      aria-hidden
      className={className}
      style={{ height: size, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}
