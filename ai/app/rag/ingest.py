"""Fetch catalog, chunk embedText by paragraphs, store in Chroma."""

from __future__ import annotations

import hashlib
import logging
import re
from typing import Any

import httpx

from app.catalog_seed import get_seed_products
from app.config import Settings, get_settings
from app.rag.store import upsert_chunks

logger = logging.getLogger(__name__)


def _product_title(product: dict[str, Any]) -> str:
    return str(product.get("title") or product.get("name") or product.get("slug") or "Product")


def _product_embed_text(product: dict[str, Any]) -> str:
    parts = [
        product.get("embedText"),
        product.get("description"),
        product.get("tagline"),
        product.get("name") or product.get("title"),
    ]
    text = "\n\n".join(str(p).strip() for p in parts if p and str(p).strip())
    return text.strip()


def chunk_by_paragraphs(text: str, *, min_chars: int = 40) -> list[str]:
    """Split on blank lines; keep short tails attached to the previous block."""
    normalized = re.sub(r"\r\n?", "\n", text).strip()
    if not normalized:
        return []

    raw = [p.strip() for p in re.split(r"\n\s*\n+", normalized) if p.strip()]
    if not raw:
        return [normalized]

    chunks: list[str] = []
    for para in raw:
        if chunks and len(para) < min_chars:
            chunks[-1] = f"{chunks[-1]}\n\n{para}"
        else:
            chunks.append(para)
    return chunks


def _snippet(text: str, limit: int = 160) -> str:
    compact = re.sub(r"\s+", " ", text).strip()
    if len(compact) <= limit:
        return compact
    return compact[: limit - 1].rstrip() + "…"


def products_to_chunks(products: list[dict[str, Any]]) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for product in products:
        slug = str(product.get("slug") or "").strip()
        if not slug:
            continue
        title = _product_title(product)
        body = _product_embed_text(product)
        paragraphs = chunk_by_paragraphs(body)
        if not paragraphs:
            continue
        for idx, para in enumerate(paragraphs):
            digest = hashlib.sha1(f"{slug}:{idx}:{para[:64]}".encode("utf-8")).hexdigest()[:12]
            records.append(
                {
                    "id": f"{slug}-{idx}-{digest}",
                    "document": para,
                    "metadata": {
                        "slug": slug,
                        "title": title,
                        "snippet": _snippet(para),
                    },
                }
            )
    return records


async def fetch_nest_products(settings: Settings) -> list[dict[str, Any]] | None:
    base = settings.nest_api_url.rstrip("/")
    url = f"{base}/products"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
    except Exception as exc:
        logger.warning("Nest catalog fetch failed (%s); using local seed.", exc)
        return None

    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("data", "products", "items"):
            if isinstance(data.get(key), list):
                return data[key]
    logger.warning("Unexpected Nest /products payload; using local seed.")
    return None


async def ingest_catalog(*, force: bool = False, settings: Settings | None = None) -> dict[str, Any]:
    settings = settings or get_settings()
    source = "seed"
    products = await fetch_nest_products(settings)
    if products:
        source = "nest"
    else:
        products = get_seed_products()

    chunks = products_to_chunks(products)
    count = upsert_chunks(chunks, settings=settings, force=force)
    return {
        "ok": True,
        "source": source,
        "products": len(products),
        "chunks": len(chunks),
        "documents": count,
        "force": force,
    }
