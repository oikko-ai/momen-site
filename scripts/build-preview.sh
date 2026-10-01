#!/usr/bin/env bash
# Builds the single-page static preview (all routes in one index.html) from the current CMS content.
# The CMS admin, API and share-image routes can't be statically exported, so they are set aside during this build.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-preview}"
mkdir -p .preview-aside
mv "src/app/(payload)" .preview-aside/payload
mv src/app/og .preview-aside/og
trap 'mv .preview-aside/payload "src/app/(payload)"; mv .preview-aside/og src/app/og; rmdir .preview-aside' EXIT
rm -rf .next out
NEXT_PUBLIC_PREVIEW=1 STATIC_EXPORT=1 npx next build
python3 scripts/preview-export.py out "$OUT"
