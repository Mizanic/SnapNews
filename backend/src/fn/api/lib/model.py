from pydantic import BaseModel


class FeedParams(BaseModel):
    country: str
    language: str
    view: str
    page_key: str | None = None
