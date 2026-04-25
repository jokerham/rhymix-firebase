#!/usr/bin/env bash
# ============================================================
# WBS 1.2.1 - Firestore Database Design & Security Rules
# Deliverable: Firestore schema doc + security rules file
#
# REQUIRES: _gen.cjs in the same folder as this file.
# Run from INSIDE the rhymix-react/ project folder.
# Prerequisites: WBS 1.1.4 complete (Firebase project linked)
# ============================================================
set -e

echo "[1/4] Installing Firestore testing library..."
npm install -D @firebase/rules-unit-testing

echo "[2/4] Generating schema, rules and seed files..."
node "$(dirname "$0")/_gen.cjs"

echo "[3/4] Deploying Firestore rules..."
npx firebase deploy --only firestore:rules
if [ $? -ne 0 ]; then
  echo "  WARNING: Could not deploy rules (are you logged in? Is the project linked?)"
  echo "  Run manually: npx firebase deploy --only firestore:rules"
fi

echo "[4/4] Deploying Firestore indexes..."
npx firebase deploy --only firestore:indexes
if [ $? -ne 0 ]; then
  echo "  WARNING: Could not deploy indexes."
  echo "  Run manually: npx firebase deploy --only firestore:indexes"
fi

echo ""
echo "============================================================"
echo " WBS 1.2.1 COMPLETE"
echo "============================================================"
echo ""
echo " Files created:"
echo "   firestore.rules              Full security rules for all collections"
echo "   firestore.indexes.json       Composite indexes for all query patterns"
echo "   src/types/firestore.ts       TypeScript interfaces matching Firestore schema"
echo "   src/services/firestore.ts    Typed collection references + helper functions"
echo "   firestore-seed/seed.cjs      Seed script to populate dev data"
echo "   tests/firestore.rules.test.ts  Rules unit tests"
echo ""
echo " Seed the database with sample data:"
echo "   node firestore-seed/seed.cjs"
echo ""
echo " Run rules tests:"
echo "   npx jest tests/firestore.rules.test.ts"
echo ""
echo " Next: WBS 1.2.2 -- Firebase Authentication setup"
echo ""
