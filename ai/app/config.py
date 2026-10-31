from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    nest_api_url: str = "http://127.0.0.1:4000"
    chroma_path: str = "./data/chroma"
    client_origin: str = "http://localhost:3000"
    chat_top_k: int = 4


@lru_cache
def get_settings() -> Settings:
    return Settings()
