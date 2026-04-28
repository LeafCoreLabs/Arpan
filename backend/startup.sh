#!/usr/bin/env bash
set -euo pipefail

python -m app.seed
exec gunicorn app.main:app \
  --workers "${WEB_CONCURRENCY:-2}" \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind "0.0.0.0:${PORT:-8000}" \
  --timeout 120
