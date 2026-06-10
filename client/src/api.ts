import type { Mascot } from './types';

export interface Results {
  jaguar: number;
  raccoon: number;
  total: number;
  /** true if this request actually counted (false = device already voted). */
  counted?: boolean;
}

/**
 * Send the binary vote + device id. Server is idempotent per device, so a
 * second submit from the same device returns the tally without counting.
 * Returns the current standings (or null on network error).
 */
export async function submitVote(vote: Mascot, deviceId: string): Promise<Results | null> {
  try {
    const r = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote, deviceId }),
      keepalive: true,
    });
    if (!r.ok) return await fetchResults();
    return (await r.json()) as Results;
  } catch {
    return null;
  }
}

/** Current community standings. */
export async function fetchResults(): Promise<Results | null> {
  try {
    const r = await fetch('/api/results');
    return (await r.json()) as Results;
  } catch {
    return null;
  }
}
