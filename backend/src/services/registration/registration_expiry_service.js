export function isPendingExpired(pending, now) {
  return now.getTime() >= new Date(pending.registrationExpiresAt).getTime();
}

export function isTokenExpired(tokenRecord, now) {
  return now.getTime() >= new Date(tokenRecord.expiresAt).getTime();
}
