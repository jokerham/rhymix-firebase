#!/usr/bin/env bash
set -euo pipefail
# ============================================================
# WBS 1.1.3 - GitHub Actions CI Pipeline
# Deliverable: ci.yml workflow (lint -> test -> build -> deploy)
#
# REQUIRES: _gen.cjs in the same folder as this file.
# Run from INSIDE the rhymix-react/ project folder.
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[1/3] Checking git repository..."
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "  No git repo found. Initialising..."
  git init
  git add .
  git commit -m "chore: initial commit"
fi

echo "[2/3] Generating GitHub Actions workflow files..."
node "$SCRIPT_DIR/_gen.cjs"

echo "[3/3] Staging workflow files for commit..."
git add .github/

echo ""
echo "============================================================"
echo " WBS 1.1.3 COMPLETE"
echo "============================================================"
echo ""
echo " Files created:"
echo "   .github/workflows/ci.yml           CI: lint + test + build on every PR"
echo "   .github/workflows/deploy.yml       CD: deploy to Firebase on release tag"
echo "   .github/pull_request_template.md   PR checklist"
echo ""
echo " ACTION REQUIRED - Add secrets to your GitHub repo:"
echo "   GitHub repo > Settings > Secrets and variables > Actions"
echo ""
echo "   Secret name                       Where to get it"
echo "   ──────────────────────────────────────────────────────────"
echo "   FIREBASE_SERVICE_ACCOUNT          Firebase Console > Project Settings"
echo "                                     > Service accounts > Generate new key"
echo "   VITE_FIREBASE_API_KEY             Firebase Console > Project Settings"
echo "   VITE_FIREBASE_AUTH_DOMAIN         > Your apps > Web app > Config"
echo "   VITE_FIREBASE_PROJECT_ID"
echo "   VITE_FIREBASE_STORAGE_BUCKET"
echo "   VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "   VITE_FIREBASE_APP_ID"
echo ""
echo " Next: WBS 1.1.4 -- Firebase project creation"
echo ""
