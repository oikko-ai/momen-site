#!/usr/bin/env bash
# Builds the single-page static preview (all routes in one index.html) from the current CMS content.
# The CMS admin and API routes can't be statically exported, so they are set aside during this build.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-preview}"
mv "src/app/(payload)" .payload-routes
trap 'mv .payload-routes "src/app/(payload)"' EXIT
rm -rf .next out
NEXT_PUBLIC_PREVIEW=1 STATIC_EXPORT=1 npx next build
python3 scripts/preview-export.py out "$OUT"
