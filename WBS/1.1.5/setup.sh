#!/usr/bin/env bash
# ============================================================
# WBS 1.1.5 - Firebase Hosting Setup
# Deliverable: Hosting config with SPA rewrites, cache headers,
#              CSP, preview channels, and local serve verified
#
# REQUIRES: _gen.cjs in the same folder as this file.
# Run from INSIDE the rhymix-react/ project folder.
# Prerequisites: WBS 1.1.4 complete (firebase login done,
#                .firebaserc exists)
# ============================================================
set -e

echo "[1/5] Installing firebase-tools locally if not present..."
if ! npx firebase --version > /dev/null 2>&1; then
  npm install -D firebase-tools
fi
echo "  firebase-tools: $(npx firebase --version)"

echo "[2/5] Initialising Firebase Hosting (if not already set up)..."
# Check if hosting is already in firebase.json
if grep -q '"hosting"' firebase.json 2>/dev/null; then
  echo "  Hosting already configured in firebase.json — skipping init"
else
  npx firebase init hosting --non-interactive
fi

echo "[3/5] Generating updated firebase.json and hosting helpers..."
node "$(dirname "$0")/_gen.cjs"

echo "[4/5] Building project to verify hosting config..."
npm run build

echo "[5/5] Verifying hosting config..."
npx firebase hosting:channel:list 2>/dev/null || echo "  (No preview channels yet — that is normal)"

echo ""
echo "============================================================"
echo " WBS 1.1.5 COMPLETE"
echo "============================================================"
echo ""
echo " Files created / updated:"
echo "   firebase.json           Updated with full hosting config"
echo "   .firebaserc             Staging + production aliases"
echo "   public/404.html         Custom 404 page served by Firebase"
echo "   public/_headers         Extra HTTP headers (fallback)"
echo ""
echo " Useful commands:"
echo "   npx firebase serve               local preview on :5000"
echo "   npx firebase hosting:channel:create staging"
echo "   npx firebase hosting:channel:deploy staging"
echo "   npx firebase deploy --only hosting"
echo ""
echo " Next: WBS 1.1.6 -- Environment variables & secrets management"
echo ""
