import { NextRequest } from "next/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(id: string): boolean {
  return UUID_RE.test(id);
}

export async function parseJSON(
  request: NextRequest
): Promise<[unknown, null] | [null, Response]> {
  try {
    const body = await request.json();
    return [body, null];
  } catch {
    return [
      null,
      Response.json({ error: "Invalid JSON body" }, { status: 400 }),
    ];
  }
}

export function invalidId(): Response {
  return Response.json({ error: "Invalid resume ID" }, { status: 400 });
}

export function unauthorized(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound(): Response {
  return Response.json({ error: "Resume not found" }, { status: 404 });
}
