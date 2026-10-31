from pydantic import BaseModel, Field

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.rag.chat import ChatRequest, ChatResponse, chat
from app.rag.ingest import ingest_catalog
from app.rag.store import collection_count

settings = get_settings()

app = FastAPI(title="NOVA Audio AI Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_origin, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IngestRequest(BaseModel):
    force: bool = False


class IngestResponse(BaseModel):
    ok: bool
    source: str
    products: int
    chunks: int
    documents: int
    force: bool = False


class HealthResponse(BaseModel):
    status: str
    chroma_documents: int = Field(description="Number of chunks in nova_catalog")
    has_docs: bool
    openai_configured: bool


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    count = collection_count(settings)
    return HealthResponse(
        status="ok",
        chroma_documents=count,
        has_docs=count > 0,
        openai_configured=bool((settings.openai_api_key or "").strip()),
    )


@app.post("/ingest", response_model=IngestResponse)
async def ingest(body: IngestRequest | None = None) -> IngestResponse:
    payload = body or IngestRequest()
    result = await ingest_catalog(force=payload.force, settings=settings)
    return IngestResponse(**result)


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(body: ChatRequest) -> ChatResponse:
    return chat(body, settings=settings)
