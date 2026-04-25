@echo off
setlocal
:: ============================================================
:: WBS 1.1.1 – Create React App with Vite + TypeScript
:: Deliverable: Vite+TS project skeleton with path aliases
::
:: REQUIRES: _gen.cjs must be in the same folder as this file.
:: Run from the directory where you want the project created.
:: ============================================================

set PROJECT_NAME=rhymix-react

echo [1/5] Scaffolding Vite + React + TypeScript project...
call npm create vite@latest %PROJECT_NAME% -- --template react-ts
if errorlevel 1 goto :error

cd %PROJECT_NAME%

echo [2/5] Installing base dependencies...
call npm install
if errorlevel 1 goto :error

echo [3/5] Installing runtime dependencies...
call npm install react-router-dom @tanstack/react-query zustand axios date-fns clsx
if errorlevel 1 goto :error

echo [4/5] Installing dev dependencies...
call npm install -D vite-tsconfig-paths @types/node vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
if errorlevel 1 goto :error

echo [5/5] Generating project files...
node "%~dp0_gen.cjs"
if errorlevel 1 goto :error

echo.
echo ============================================================
echo  WBS 1.1.1 COMPLETE  --  %PROJECT_NAME%\
echo ============================================================
echo.
echo  src\
echo    components\  (ui, layout, board, document, comment, member, admin)
echo    pages\       (auth, board, admin)
echo    hooks\   store\   services\   assets\
echo    types\       index.ts   (Member, Board, Document, Comment, Group)
echo    config\      constants.ts  (ROUTES, PAGINATION, FILE_UPLOAD)
echo    utils\       cn.ts, format.ts
echo    test\        setup.ts
echo    main.tsx     (QueryClient + BrowserRouter entry point)
echo    App.tsx      (route skeleton with placeholder pages)
echo.
echo  vite.config.ts   path aliases + vitest config
echo  tsconfig.json    strict TS + path aliases
echo.
echo  Next steps:
echo    cd %PROJECT_NAME%
echo    npm run dev          -> http://localhost:3000
echo    npm run type-check
echo    npm test
echo.
echo  Next activity: WBS 1.1.2 -- ESLint + Prettier + Husky
echo.
goto :end

:error
echo.
echo [ERROR] Setup failed. See output above for details.
exit /b 1

:end
endlocal
