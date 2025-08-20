FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy source
COPY . /app

# Switch to backend directory so Python imports like `from app...` resolve
WORKDIR /app/backend

EXPOSE 8000

# Run uvicorn from backend working directory
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 