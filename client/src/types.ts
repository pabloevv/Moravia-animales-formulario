// 0 = Jaguar (explosive power), 1 = Raccoon (tactical intelligence).
export const JAGUAR = 0 as const;
export const RACCOON = 1 as const;

export type Mascot = typeof JAGUAR | typeof RACCOON;

export type Stage = 'start' | 'learn' | 'choose' | 'result';

/** One of the six volleyball court positions, carrying a piece of mascot info. */
export interface CourtPosition {
  zone: number; // 1–6 (volleyball rotation number)
  value: string; // short label
  long: string; // broad explanation (shown in the modal on tap)
}

export interface MascotInfo {
  team: Mascot;
  name: string;
  img: string;
  intro: string;
  /** Exactly 6, already ordered for the 3×2 layout: front 4-3-2, back 5-6-1. */
  positions: CourtPosition[];
}
