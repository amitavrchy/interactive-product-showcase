"""Retrieve catalog chunks and answer with OpenAI or offline template."""

from __future__ import annotations

import logging
from typing import Any, Literal

from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.rag.store import query_chunks

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are NOVA Audio’s product expert. Answer only from provided context. "
    "If unknown, say you don’t know and suggest a product to compare. "
    "Prefer concise, sensory language. Cite product slugs."
)


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list)
    productSlug: str | None = None


class Citation(BaseModel):
    slug: str
    title: str
    snippet: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation]


def _latest_user_message(messages: list[ChatMessage]) -> str:
    for msg in reversed(messages):
        if msg.role == "user" and msg.content.strip():
            return msg.content.strip()
    return ""


def _format_context(hits: list[dict[str, Any]]) -> str:
    blocks: list[str] = []
    for i, hit in enumerate(hits, start=1):
        blocks.append(
            f"[{i}] slug={hit.get('slug')} title={hit.get('title')}\n"
            f"{hit.get('document', '')}"
        )
    return "\n\n".join(blocks)


def _citations_from_hits(hits: list[dict[str, Any]]) -> list[Citation]:
    seen: set[str] = set()
    citations: list[Citation] = []
    for hit in hits:
        slug = str(hit.get("slug") or "")
        if not slug or slug in seen:
            continue
        seen.add(slug)
        citations.append(
            Citation(
                slug=slug,
                title=str(hit.get("title") or slug),
                snippet=str(hit.get("snippet") or "")[:200],
            )
        )
    return citations


def _offline_answer(question: str, hits: list[dict[str, Any]]) -> str:
    if not hits:
        return (
            "I don’t have catalog context loaded yet. "
            "Try ingesting products first, or compare nova-h1, nova-s1, and nova-buds."
        )

    lines = [
        "Here’s what the NOVA catalog says (offline demo mode — no OpenAI key):",
        "",
    ]
    for hit in hits[:3]:
        slug = hit.get("slug") or "product"
        title = hit.get("title") or slug
        snippet = hit.get("snippet") or (hit.get("document") or "")[:160]
        lines.append(f"• **{title}** (`{slug}`): {snippet}")
    lines.append("")
    if question:
        lines.append(
            "If you need a deeper comparison, ask about battery, drivers, or comfort — "
            "or set a productSlug to focus retrieval."
        )
    else:
        lines.append("Ask about materials, drivers, battery, or comfort for a focused answer.")
    return "\n".join(lines)


def _openai_answer(
    *,
    question: str,
    messages: list[ChatMessage],
    context: str,
    settings: Settings,
) -> str:
    from openai import OpenAI

    history = [
        {"role": m.role, "content": m.content}
        for m in messages
        if m.role in ("user", "assistant") and m.content.strip()
    ]
    # Ensure the latest user turn is present.
    if not history or history[-1]["role"] != "user":
        history.append({"role": "user", "content": question or "Tell me about NOVA products."})

    client = OpenAI(api_key=settings.openai_api_key.strip())
    completion = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.4,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "system",
                "content": f"Product context:\n{context}" if context else "No catalog context available.",
            },
            *history,
        ],
    )
    return (completion.choices[0].message.content or "").strip()


def chat(request: ChatRequest, settings: Settings | None = None) -> ChatResponse:
    settings = settings or get_settings()
    question = _latest_user_message(request.messages)
    query = question or (request.productSlug or "NOVA Audio products")

    hits = query_chunks(
        query,
        top_k=settings.chat_top_k,
        product_slug=request.productSlug,
        settings=settings,
    )
    citations = _citations_from_hits(hits)
    context = _format_context(hits)

    has_key = bool((settings.openai_api_key or "").strip())
    if not has_key:
        answer = _offline_answer(question, hits)
        return ChatResponse(answer=answer, citations=citations)

    try:
        answer = _openai_answer(
            question=question,
            messages=request.messages,
            context=context,
            settings=settings,
        )
    except Exception as exc:
        logger.warning("OpenAI chat failed; falling back to offline template: %s", exc)
        answer = _offline_answer(question, hits)

    return ChatResponse(answer=answer, citations=citations)
