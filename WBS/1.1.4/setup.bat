@echo off
setlocal
:: ============================================================
:: WBS 1.1.4 - Firebase Project Creation
:: Deliverable: Firebase project with all services enabled,
::              firebase.json, .firebaserc, src/config/firebase.ts
::
:: REQUIRES: _gen.cjs in the same folder as this file.
:: Run from INSIDE the rhymix-react\ project folder.
::
:: Prerequisites:
::   - Node.js installed
::   - A Google account
::   - Firebase project already created at https://console.firebase.google.com
::     (the script will link to it; it cannot create a project for you)
:: ============================================================

echo [1/5] Installing Firebase tools and SDK...
call npm install -D firebase-tools
if errorlevel 1 goto :error
call npm install firebase
if errorlevel 1 goto :error

echo [2/5] Logging in to Firebase...
call npx firebase login
if errorlevel 1 goto :error

echo [3/5] Linking this folder to your Firebase project...
echo.
echo   You will be asked to select a Firebase project.
echo   Choose the project you created at console.firebase.google.com
echo.
call npx firebase use --add
if errorlevel 1 goto :error

echo [4/5] Generating firebase.json, .firebaserc and src config...
node "%~dp0_gen.cjs"
if errorlevel 1 goto :error

echo [5/5] Verifying Firebase connection...
call npx firebase projects:list
if errorlevel 1 goto :error

echo.
echo ============================================================
echo  WBS 1.1.4 COMPLETE
echo ============================================================
echo.
echo  Files created:
echo    firebase.json              Hosting + Functions + Firestore + Storage rules
echo    .firebaserc                Project alias mapping
echo    src\config\firebase.ts     Initialised Firebase app + service exports
echo    .env.local                 Your Firebase config values (DO NOT COMMIT)
echo    firestore.rules            Placeholder security rules
echo    storage.rules              Placeholder storage rules
echo    firestore.indexes.json     Firestore composite index definitions
echo.
echo  ACTION REQUIRED:
echo    Fill in your Firebase config values in .env.local
echo    (copy from Firebase Console > Project Settings > Your apps > Web app)
echo.
echo    VITE_FIREBASE_API_KEY=
echo    VITE_FIREBASE_AUTH_DOMAIN=
echo    VITE_FIREBASE_PROJECT_ID=
echo    VITE_FIREBASE_STORAGE_BUCKET=
echo    VITE_FIREBASE_MESSAGING_SENDER_ID=
echo    VITE_FIREBASE_APP_ID=
echo    VITE_FIREBASE_MEASUREMENT_ID=
echo.
echo  Enable these services in Firebase Console:
echo    Authentication  > Get started
echo    Firestore       > Create database (start in test mode)
echo    Storage         > Get started
echo    Functions       > Get started (requires Blaze plan)
echo    Hosting         > Get started
echo.
echo  Next: WBS 1.1.5 -- Firebase Hosting setup
echo.
goto :end

:error
echo.
echo [ERROR] Setup failed. See output above.
exit /b 1

:end
endlocal
