import { IncomingMessage, ServerResponse } from "node:http";

export function readBody(req: IncomingMessage): Promise<unknown | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch {
        resolve(null);
      }
    });
  });
}

export function sendJson(
  res: ServerResponse,
  status: number,
  payload?: object,
) {
  res.writeHead(
    status,
    payload ? { "Content-Type": "application/json" } : undefined,
  );
  res.end(payload ? JSON.stringify(payload) : undefined);
}
