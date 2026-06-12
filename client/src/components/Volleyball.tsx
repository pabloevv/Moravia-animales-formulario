interface Props {
  /** Rendered height in px (width follows the art's aspect ratio). */
  size?: number;
  className?: string;
}

/** Volleyball graphic (20.svg → /assets/volleyball.svg). */
export function Volleyball({ size = 130, className }: Props) {
  return (
    <img
      src="/assets/volleyball.svg"
      alt=""
      aria-hidden
      className={className}
      style={{ height: size, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}
