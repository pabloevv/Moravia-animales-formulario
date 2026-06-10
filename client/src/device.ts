import { JAGUAR, RACCOON, type Mascot } from './types';

const DEVICE_KEY = 'advcm_device';
const VOTE_KEY = 'advcm_vote';

/** Stable per-device id, persisted in localStorage. Generated once. */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/** Which mascot this device already got, or null if it hasn't voted. */
export function getPriorVote(): Mascot | null {
  const v = localStorage.getItem(VOTE_KEY);
  if (v === '0') return JAGUAR;
  if (v === '1') return RACCOON;
  return null;
}

export function markVoted(mascot: Mascot): void {
  localStorage.setItem(VOTE_KEY, String(mascot));
}
