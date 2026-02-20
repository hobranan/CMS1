const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export function computeExpiresAt(issuedAtIso) {
  return new Date(new Date(issuedAtIso).getTime() + FOURTEEN_DAYS_MS).toISOString();
}

export function isInvitationExpired({ issuedAtIso, now }) {
  const issuedAtMs = new Date(issuedAtIso).getTime();
  return now.getTime() >= issuedAtMs + FOURTEEN_DAYS_MS;
}

