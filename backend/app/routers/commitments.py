from fastapi import APIRouter, Depends
from typing import List, Optional

from ..db import get_db
from ..schemas import Commitment

router = APIRouter()


@router.get("/commitments", response_model=List[Commitment])
def list_commitments(
    asset_class: Optional[str] = None,
    investor_name: Optional[str] = None,
    conn = Depends(get_db),
):
    base_sql = (
        """
        SELECT c.id,
               c.investor_id,
               i.name AS investor_name,
               c.asset_class,
               c.amount,
               c.currency
        FROM commitments c
        JOIN investors i ON i.id = c.investor_id
        """
    )

    clauses = []
    params: list = []

    if asset_class:
        clauses.append("c.asset_class = ?")
        params.append(asset_class)

    if investor_name:
        clauses.append("i.name LIKE ?")
        params.append(f"%{investor_name}%")

    if clauses:
        base_sql += " WHERE " + " AND ".join(clauses)

    base_sql += " ORDER BY i.name ASC, c.id ASC"

    rows = conn.execute(base_sql, tuple(params)).fetchall()
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