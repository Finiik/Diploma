@echo off
echo ============================================
echo   SciLearn - Firebase Deployment
echo ============================================
echo.
echo Step 1: Firebase Login
echo (A browser window will open for authentication)
echo.
call npx firebase-tools login
echo.
echo Step 2: Building production bundle...
call npm run build
echo.
echo Step 3: Deploying to Firebase Hosting...
call npx firebase-tools deploy --only hosting
echo.
echo Step 4: Deploying Firestore Rules...
call npx firebase-tools deploy --only firestore:rules
echo.
echo ============================================
echo   Deployment complete!
echo   Your app is live at:
echo   https://scilearn-be957.web.app
echo ============================================
pause
