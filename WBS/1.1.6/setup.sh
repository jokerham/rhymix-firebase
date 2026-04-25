#!/usr/bin/env bash
# ============================================================
# WBS 1.1.6 - Environment Variables & Secrets Management
# Deliverable: .env files per environment, type-safe env access,
#              validation on startup, GitHub Secrets documentation
#
# REQUIRES: _gen.cjs in the same folder as this file.
# Run from INSIDE the rhymix-react/ project folder.
# ============================================================
set -e

echo "[1/3] Installing env validation library..."
npm install zod

echo "[2/3] Generating env config files..."
node "$(dirname "$0")/_gen.cjs"

echo "[3/3] Verifying env setup..."
# Confirm .env.local exists (created in 1.1.4, should not be overwritten)
if [ ! -f ".env.local" ]; then
  echo "  WARNING: .env.local not found."
  echo "  Copy .env.local.example to .env.local and fill in your Firebase values."
else
  echo "  .env.local found"
fi

# Confirm all example files exist
for f in .env.example .env.development .env.staging .env.production; do
  [ -f "$f" ] && echo "  $f found" || echo "  WARNING: $f missing"
done

echo ""
echo "============================================================"
echo " WBS 1.1.6 COMPLETE"
echo "============================================================"
echo ""
echo " Files created:"
echo "   .env.example              All variables documented (commit this)"
echo "   .env.development          Dev defaults (emulator on, analytics off)"
echo "   .env.staging              Staging defaults"
echo "   .env.production           Production defaults"
echo "   .env.local.example        Template to copy to .env.local"
echo "   src/config/env.ts         Zod-validated, type-safe env access"
echo "   src/config/firebase.ts    Updated to use validated env config"
echo "   scripts/check-env.cjs     Pre-flight env check script"
echo ""
echo " Workflow:"
echo "   1. Copy .env.local.example to .env.local"
echo "   2. Fill in your Firebase values in .env.local"
echo "   3. Run: node scripts/check-env.cjs   (validates all vars)"
echo "   4. Import env from src/config/env.ts  (not import.meta.env directly)"
echo ""
echo " GitHub Secrets to add (Settings > Secrets > Actions):"
echo "   VITE_FIREBASE_API_KEY"
echo "   VITE_FIREBASE_AUTH_DOMAIN"
echo "   VITE_FIREBASE_PROJECT_ID"
echo "   VITE_FIREBASE_STORAGE_BUCKET"
echo "   VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "   VITE_FIREBASE_APP_ID"
echo "   VITE_FIREBASE_MEASUREMENT_ID"
echo "   FIREBASE_SERVICE_ACCOUNT"
echo ""
echo " Next: WBS 1.2.1 -- Firestore database design & rules"
echo ""
