import csv
from io import StringIO
from typing import Dict

from fastapi import APIRouter, Depends, UploadFile, File

from ..db import get_db

router = APIRouter()


@router.post("/ingest_data")
async def ingest_data(file: UploadFile = File(...), conn = Depends(get_db)) -> Dict[str, int]:
    raw = await file.read()
    text = raw.decode("utf-8-sig")
    await file.close()

    reader = csv.DictReader(StringIO(text))

    investors_created = 0
    commitments_created = 0

    for row in reader:
        name = (row.get("Investor Name") or "").strip()
        if not name:
            continue

        investor_type = (row.get("Investory Type") or None)
        country = (row.get("Investor Country") or None)
        date_added = (row.get("Investor Date Added") or None)
        last_updated = (row.get("Investor Last Updated") or None)

        # Create investor if not exists (by unique name)
        result = conn.execute(
            """
            INSERT OR IGNORE INTO investors(name, investor_type, country, date_added, last_updated)
            VALUES(?, ?, ?, ?, ?)
            """,
            (name, investor_type, country, date_added, last_updated),
        )
        if result.rowcount:
            investors_created += 1

        investor_id = conn.execute(
            "SELECT id FROM investors WHERE name = ?",
            (name,),
        ).fetchone()["id"]

        # Update invester details if not new investor
        if not result.rowcount:
            conn.execute(
                """
                UPDATE investors
                SET investor_type = COALESCE(?, investor_type),
                    country = COALESCE(?, country),
                    date_added = COALESCE(?, date_added),
                    last_updated = COALESCE(?, last_updated)
                WHERE id = ?
                """,
                (investor_type, country, date_added, last_updated, investor_id),
            )

        amount_raw = row.get("Commitment Amount")
        try:
            amount = int(amount_raw) if amount_raw is not None else 0
        except Exception:
            amount = 0

        asset_class = (row.get("Commitment Asset Class") or None)
        currency = (row.get("Commitment Currency") or None)

        conn.execute(
            """
            INSERT INTO commitments(investor_id, asset_class, amount, currency)
            VALUES(?, ?, ?, ?)
            """,
            (investor_id, asset_class, amount, currency),
        )
        commitments_created += 1

    conn.commit()

    return {"investors_created": investors_created, "commitments_created": commitments_created} 