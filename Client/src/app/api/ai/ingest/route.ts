import { NextResponse } from "next/server";

const AI_URL = process.env.AI_SERVICE_URL ?? "http://127.0.0.1:8000";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const upstream = await fetch(`${AI_URL}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await upstream.json().catch(() => ({ ok: upstream.ok }));
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { ok: true, mode: "local-fallback", message: "AI service offline; client uses catalog fallback." },
      { status: 200 },
    );
  }
}
