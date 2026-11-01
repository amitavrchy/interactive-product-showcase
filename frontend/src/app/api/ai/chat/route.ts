import { NextResponse } from "next/server";
import { CATALOG } from "@/data/catalog";

const AI_URL = process.env.AI_SERVICE_URL ?? "http://127.0.0.1:8000";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const upstream = await fetch(`${AI_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    if (upstream.ok) {
      return NextResponse.json(await upstream.json());
    }
  } catch {
    // fall through to local RAG-lite
  }

  const question = String(body?.messages?.at(-1)?.content ?? "").toLowerCase();
  const slugHint = body?.productSlug as string | undefined;
  const scored = CATALOG.map((p) => {
    const hay = `${p.name} ${p.tagline} ${p.embedText} ${p.description}`.toLowerCase();
    let score = 0;
    if (slugHint && p.slug === slugHint) score += 5;
    for (const word of question.split(/\W+/).filter(Boolean)) {
      if (hay.includes(word)) score += 1;
    }
    return { p, score };
  }).sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 2).filter((s) => s.score > 0);
  const picks = top.length ? top : [{ p: CATALOG[0], score: 1 }];
  const primary = picks[0].p;

  return NextResponse.json({
    answer: `From the NOVA catalog: ${primary.name} — ${primary.tagline} Specs highlight ${primary.specs.drivers} and ${primary.specs.battery}. Base price $${primary.basePrice}. ${
      picks[1] ? `You might also compare ${picks[1].p.name}.` : "Configure yours for color and engraving."
    }`,
    citations: picks.map(({ p }) => ({
      slug: p.slug,
      title: p.name,
      snippet: p.embedText.slice(0, 160) + "…",
    })),
  });
}
