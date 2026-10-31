"""Chroma persistence for the nova_catalog collection."""

from __future__ import annotations

import hashlib
import math
from pathlib import Path
from typing import Any

import chromadb
from chromadb.api.models.Collection import Collection
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings

from app.config import Settings, get_settings

COLLECTION_NAME = "nova_catalog"
EMBED_DIM = 384


class HashEmbeddingFunction(EmbeddingFunction[Documents]):
    """Deterministic offline embedding when OpenAI is unavailable."""

    def __call__(self, input: Documents) -> Embeddings:
        vectors: Embeddings = []
        for text in input:
            digest = hashlib.sha256(text.encode("utf-8")).digest()
            # Expand hash bytes into a fixed-size float vector.
            raw = list(digest) * ((EMBED_DIM // len(digest)) + 1)
            vec = [((b / 255.0) * 2.0) - 1.0 for b in raw[:EMBED_DIM]]
            norm = math.sqrt(sum(v * v for v in vec)) or 1.0
            vectors.append([v / norm for v in vec])
        return vectors


def _embedding_function(settings: Settings) -> EmbeddingFunction[Documents] | None:
    key = (settings.openai_api_key or "").strip()
    if not key:
        return HashEmbeddingFunction()
    try:
        from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

        return OpenAIEmbeddingFunction(
            api_key=key,
            model_name="text-embedding-3-small",
        )
    except Exception:
        return HashEmbeddingFunction()


def get_chroma_client(settings: Settings | None = None) -> chromadb.PersistentClient:
    settings = settings or get_settings()
    path = Path(settings.chroma_path)
    path.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(path.resolve()))


def get_collection(settings: Settings | None = None) -> Collection:
    settings = settings or get_settings()
    client = get_chroma_client(settings)
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=_embedding_function(settings),
        metadata={"hnsw:space": "cosine"},
    )


def collection_count(settings: Settings | None = None) -> int:
    try:
        return int(get_collection(settings).count())
    except Exception:
        return 0


def reset_collection(settings: Settings | None = None) -> Collection:
    settings = settings or get_settings()
    client = get_chroma_client(settings)
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    return get_collection(settings)


def upsert_chunks(
    chunks: list[dict[str, Any]],
    *,
    settings: Settings | None = None,
    force: bool = False,
) -> int:
    """Upsert chunk records. Each item needs id, document, metadata."""
    settings = settings or get_settings()
    collection = reset_collection(settings) if force else get_collection(settings)

    if not chunks:
        return collection.count()

    # Deduplicate by id within this batch.
    by_id: dict[str, dict[str, Any]] = {c["id"]: c for c in chunks}
    items = list(by_id.values())

    collection.upsert(
        ids=[c["id"] for c in items],
        documents=[c["document"] for c in items],
        metadatas=[c["metadata"] for c in items],
    )
    return collection.count()


def query_chunks(
    query: str,
    *,
    top_k: int = 4,
    product_slug: str | None = None,
    settings: Settings | None = None,
) -> list[dict[str, Any]]:
    settings = settings or get_settings()
    collection = get_collection(settings)
    if collection.count() == 0:
        return []

    where = {"slug": product_slug} if product_slug else None
    result = collection.query(
        query_texts=[query],
        n_results=min(top_k, max(collection.count(), 1)),
        where=where,
        include=["documents", "metadatas", "distances"],
    )

    docs = (result.get("documents") or [[]])[0]
    metas = (result.get("metadatas") or [[]])[0]
    distances = (result.get("distances") or [[]])[0]

    hits: list[dict[str, Any]] = []
    for i, doc in enumerate(docs):
        meta = metas[i] if i < len(metas) else {}
        hits.append(
            {
                "document": doc or "",
                "slug": (meta or {}).get("slug", ""),
                "title": (meta or {}).get("title", ""),
                "snippet": (meta or {}).get("snippet", "") or (doc or "")[:180],
                "distance": distances[i] if i < len(distances) else None,
            }
        )
    return hits
