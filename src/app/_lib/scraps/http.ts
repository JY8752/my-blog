import "server-only";

import { AccessDeniedError } from "./access";
import { ScrapConflictError, ScrapNotFoundError } from "./errors";
import { ScrapValidationError } from "./validation";

const MAX_JSON_BYTES = 64 * 1024;

export class RequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (process.env.NODE_ENV === "development" && !origin) return;

  if (!origin || origin !== new URL(request.url).origin) {
    throw new RequestError(403, "不正な送信元です。");
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLocaleLowerCase().startsWith("application/json")) {
    throw new RequestError(415, "Content-Typeはapplication/jsonを指定してください。");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    throw new RequestError(413, "リクエストが大きすぎます。");
  }

  if (!request.body) throw new RequestError(400, "リクエスト本文がありません。");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_JSON_BYTES) {
      await reader.cancel();
      throw new RequestError(413, "リクエストが大きすぎます。");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestError(400, "JSONの形式が正しくありません。");
  }
}

export function apiErrorResponse(error: unknown): Response {
  if (error instanceof ScrapValidationError) {
    return Response.json({ message: error.message, fields: error.fields }, { status: 400 });
  }
  if (error instanceof AccessDeniedError) {
    return Response.json({ message: error.message }, { status: 403 });
  }
  if (error instanceof RequestError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  if (error instanceof ScrapNotFoundError) {
    return Response.json({ message: error.message }, { status: 404 });
  }
  if (error instanceof ScrapConflictError) {
    return Response.json({ message: error.message }, { status: 409 });
  }

  console.error(
    JSON.stringify({
      event: "scraps_api_error",
      message: error instanceof Error ? error.message : "Unknown error",
    }),
  );
  return Response.json({ message: "処理中にエラーが発生しました。" }, { status: 500 });
}
