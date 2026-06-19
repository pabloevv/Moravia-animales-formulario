export const VOTING_DECISION_DATE = 'viernes 19 de junio';
export const VOTING_DECISION_DEADLINE = new Date('2026-06-19T12:00:00-06:00').getTime();

export function getRemainingVotingTime(now = Date.now()) {
  const diff = Math.max(VOTING_DECISION_DEADLINE - now, 0);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, finished: diff === 0 };
}

export function isVotingClosed(now = Date.now()) {
  return now >= VOTING_DECISION_DEADLINE;
}
