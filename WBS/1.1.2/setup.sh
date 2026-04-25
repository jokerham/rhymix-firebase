#!/usr/bin/env bash
set -euo pipefail
# ============================================================
# WBS 1.1.2 - ESLint + Prettier + Husky
# Deliverable: Linting config files + pre-commit hooks
#
# REQUIRES: _gen.cjs and _hook.cjs in the same folder.
# Run from INSIDE the rhymix-react/ project folder.
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[1/5] Pinning ESLint to v9 (removes v10 installed by Vite scaffold)..."
npm install -D --legacy-peer-deps eslint@^9 @eslint/js@^9

echo "[2/5] Installing ESLint plugins, Prettier and Husky..."
npm install -D --legacy-peer-deps \
  typescript-eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import-x \
  prettier \
  eslint-config-prettier \
  husky \
  lint-staged

echo "[3/5] Generating config files..."
node "$SCRIPT_DIR/_gen.cjs"

echo "[4/5] Initialising Husky..."
npx husky init

echo "[5/5] Writing Husky pre-commit hook..."
node "$SCRIPT_DIR/_hook.cjs"

echo ""
echo "============================================================"
echo " WBS 1.1.2 COMPLETE"
echo "============================================================"
echo ""
echo " Files created / updated:"
echo "   eslint.config.js       ESLint flat-config (TS + React + a11y)"
echo "   .prettierrc.json       Prettier formatting rules"
echo "   .prettierignore        Files Prettier should skip"
echo "   .editorconfig          Consistent editor settings"
echo "   .husky/pre-commit      Runs lint-staged before every commit"
echo "   package.json           Added lint, format, prepare scripts"
echo "                          and lint-staged config"
echo ""
echo " Verify:"
echo "   npm run lint"
echo "   npm run format"
echo "   git add . && git commit -m \"chore: setup linting\""
echo ""
echo " Next: WBS 1.1.3 -- GitHub Actions CI pipeline"
echo ""
