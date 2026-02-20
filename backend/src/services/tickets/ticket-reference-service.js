import crypto from "node:crypto";

export function createTicketReference() {
  return `TKT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

