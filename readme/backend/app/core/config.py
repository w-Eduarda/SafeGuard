from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./safeguard.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Keys
    OPENAI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
