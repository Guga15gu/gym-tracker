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

type JsonResponse = { status: number; payload: object };
export function sendJson(res: ServerResponse, response: JsonResponse) {
  res.writeHead(response.status, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(response.payload));
}

export function send204(res: ServerResponse) {
  res.writeHead(204);
  return res.end();
}
