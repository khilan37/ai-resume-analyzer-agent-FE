#!/bin/sh
set -eu

cat <<EOF >/app/public/env.js
window.__env = {
  apiBaseUrl: "${API_BASE_URL:-http://localhost:8080/api}",
  demoUserId: "${DEMO_USER_ID:-2e421edd-ae3d-4206-bf6e-193d1872bf8f}"
};
EOF

exec serve -s /app/public -l "tcp://0.0.0.0:${PORT:-10000}"
