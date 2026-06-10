// 0 = Jaguar (explosive power), 1 = Raccoon (tactical intelligence).
export const JAGUAR = 0 as const;
export const RACCOON = 1 as const;

export type Mascot = typeof JAGUAR | typeof RACCOON;

export type Stage = 'start' | 'intro' | 'quiz' | 'result';

export interface Answer {
  label: string;
  /** Which mascot this answer feeds points to. */
  mascot: Mascot;
}

export interface Question {
  id: string;
  prompt: string;
  answers: Answer[];
}
