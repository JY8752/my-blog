import "server-only";

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { getAccessConfiguration } from "./database";

interface AdminIdentity {
  email: string;
}

export class AccessDeniedError extends Error {
  constructor(message = "管理者権限を確認できませんでした。") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

const jwksByIssuer = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getRemoteJwks(issuer: string) {
  const cached = jwksByIssuer.get(issuer);
  if (cached) return cached;

  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  jwksByIssuer.set(issuer, jwks);
  return jwks;
}

function isConfigured(value: string): boolean {
  return value.length > 0 && !value.includes("CHANGE_ME");
}

export async function verifyAccessToken(
  token: string | null,
  configuration: { teamDomain: string; audience: string },
): Promise<JWTPayload> {
  if (!token) throw new AccessDeniedError();

  const issuer = configuration.teamDomain.replace(/\/+$/, "");
  if (!isConfigured(issuer) || !isConfigured(configuration.audience)) {
    throw new AccessDeniedError("Cloudflare Accessの設定が完了していません。");
  }

  try {
    const { payload } = await jwtVerify(token, getRemoteJwks(issuer), {
      issuer,
      audience: configuration.audience,
    });
    return payload;
  } catch {
    throw new AccessDeniedError();
  }
}

export async function requireAdmin(headers: Headers): Promise<AdminIdentity> {
  if (process.env.NODE_ENV === "development") {
    return { email: "local-development" };
  }

  const payload = await verifyAccessToken(
    headers.get("cf-access-jwt-assertion"),
    getAccessConfiguration(),
  );

  if (typeof payload.email !== "string" || payload.email.length === 0) {
    throw new AccessDeniedError();
  }

  return { email: payload.email };
}
