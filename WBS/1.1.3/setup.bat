@echo off
setlocal
:: ============================================================
:: WBS 1.1.3 - GitHub Actions CI Pipeline
:: Deliverable: ci.yml workflow (lint -> test -> build -> deploy)
::
:: REQUIRES: _gen.cjs in the same folder as this file.
:: Run from INSIDE the rhymix-react\ project folder.
:: ============================================================

echo [1/3] Checking git repository...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo   No git repo found. Initialising...
  call git init
  call git add .
  call git commit -m "chore: initial commit"
)

echo [2/3] Generating GitHub Actions workflow files...
node "%~dp0_gen.cjs"
if errorlevel 1 goto :error

echo [3/3] Staging workflow files for commit...
call git add .github\
if errorlevel 1 goto :error

echo.
echo ============================================================
echo  WBS 1.1.3 COMPLETE
echo ============================================================
echo.
echo  Files created:
echo    .github\workflows\ci.yml           CI: lint + test + build on every PR
echo    .github\workflows\deploy.yml       CD: deploy to Firebase on release tag
echo    .github\pull_request_template.md   PR checklist
echo.
echo  ACTION REQUIRED - Add secrets to your GitHub repo:
echo    GitHub repo ^> Settings ^> Secrets and variables ^> Actions
echo.
echo    Secret name                       Where to get it
echo    ──────────────────────────────────────────────────────────
echo    FIREBASE_SERVICE_ACCOUNT          Firebase Console ^> Project Settings
echo                                      ^> Service accounts ^> Generate new key
echo    VITE_FIREBASE_API_KEY             Firebase Console ^> Project Settings
echo    VITE_FIREBASE_AUTH_DOMAIN         ^> Your apps ^> Web app ^> Config
echo    VITE_FIREBASE_PROJECT_ID
echo    VITE_FIREBASE_STORAGE_BUCKET
echo    VITE_FIREBASE_MESSAGING_SENDER_ID
echo    VITE_FIREBASE_APP_ID
echo.
echo  Next: WBS 1.1.4 -- Firebase project creation
echo.
goto :end

:error
echo.
echo [ERROR] Setup failed. See output above.
exit /b 1

:end
endlocal
