from fastapi import APIRouter, Depends
from typing import List

from ..db import get_db
from ..schemas import InvestorSummary

router = APIRouter()


@router.get("/investors", response_model=List[InvestorSummary])
def list_investors(conn = Depends(get_db)):
    sql = (
        """
        SELECT i.id,
               i.name,
               i.investor_type,
               i.country,
               i.date_added,
               i.last_updated,
               COALESCE(SUM(c.amount), 0) AS total_commitment
        FROM investors i
        LEFT JOIN commitments c ON c.investor_id = i.id
        GROUP BY i.id, i.name, i.investor_type, i.country, i.date_added, i.last_updated
        ORDER BY i.id ASC
        """
    )
    rows = conn.execute(sql).fetchall()
    return [
        InvestorSummary(
            id=row["id"],
            name=row["name"],
            investor_type=row["investor_type"],
            country=row["country"],
            date_added=row["date_added"],
            last_updated=row["last_updated"],
            total_commitment=int(row["total_commitment"] or 0),
        )
        for row in rows
    ] 