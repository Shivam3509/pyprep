from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PyPrep API"
    SECRET_KEY: str = "supersecretkey_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Defaults to SQLite using aiosqlite for local standalone execution
    DATABASE_URL: str = "sqlite+aiosqlite:///./pyprep.db"
    
    # Mock settings
    MOCK_AI_RESPONSES: bool = True
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
