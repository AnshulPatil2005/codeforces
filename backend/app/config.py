from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # API Settings
    codeforces_api_base_url: str = "https://codeforces.com/api"
    secret_key: str = "your-default-secret-key-change-me-in-production"

    # Cache Settings
    cache_ttl_seconds: int = 300  # 5 minutes

    # Rate Limiting
    rate_limit_calls: int = 5  # calls per period
    rate_limit_period: float = 1.0  # seconds

    # CORS Settings
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> list[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
