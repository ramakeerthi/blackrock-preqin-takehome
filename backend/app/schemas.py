from datetime import date
from pydantic import BaseModel
from typing import Optional

# Investor Summary
class InvestorSummary(BaseModel):
    id: int
    name: str
    investor_type: Optional[str] = None
    country: Optional[str] = None
    date_added: Optional[date] = None
    last_updated: Optional[date] = None
    total_commitment: int

    class Config:
        from_attributes = True

# Commitment
class Commitment(BaseModel):
    id: int
    investor_id: int
    asset_class: Optional[str] = None
    amount: int
    currency: Optional[str] = None

    class Config:
        from_attributes = True 