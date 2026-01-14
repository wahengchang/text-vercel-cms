import "server-only";

import crypto from "crypto";

const SESSION_COOKIE = "admin_session";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }
  return value;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionToken(): string {
  const secret = requireEnv("AUTH_SECRET");
  return crypto.createHmac("sha256", secret).update("admin").digest("hex");
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL,
    password: requireEnv("ADMIN_PASSWORD"),
  };
}
