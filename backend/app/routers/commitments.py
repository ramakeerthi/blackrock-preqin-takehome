from fastapi import APIRouter, Depends
from typing import List

from ..db import get_db
from ..schemas import Commitment

router = APIRouter()


@router.get("/commitments", response_model=List[Commitment])
def list_commitments(conn = Depends(get_db)):
    sql = (
        """
        SELECT c.id,
               c.investor_id,
               i.name AS investor_name,
               c.asset_class,
               c.amount,
               c.currency
        FROM commitments c
        JOIN investors i ON i.id = c.investor_id
        ORDER BY i.name ASC, c.id ASC
        """
    )
    rows = conn.execute(sql).fetchall()
    return [
        Commitment(
            id=row["id"],
            investor_id=row["investor_id"],
            investor_name=row["investor_name"],
            asset_class=row["asset_class"],
            amount=int(row["amount"] or 0),
            currency=row["currency"],
        )
        for row in rows
    ] 