@echo off
REM Android APK Build Script for Ibnu Portfolio (Windows)
REM This script helps build an Android APK using Expo EAS

echo ======================================
echo   Ibnu Portfolio - Android APK Builder
echo ======================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to script directory
cd /d "%~dp0"

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Installing EAS CLI...
call npm install -g eas-cli

echo.
echo Step 3: Checking Expo login status...
call eas whoami >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo You are not logged in to Expo.
    echo Please create an account at: https://expo.dev/signup
    echo.
    echo Then run: eas login
    echo.
    pause
)

echo.
echo Step 4: Initializing EAS project...
call eas init --non-interactive 2>nul

echo.
echo Step 5: Building Android APK...
echo This will take approximately 10-15 minutes.
echo The APK will be built in Expo's cloud servers.
echo.

call eas build --platform android --profile preview

echo.
echo ======================================
echo   Build Complete!
echo ======================================
echo.
echo The download link for your APK will be shown above.
echo You can also find it at: https://expo.dev
pause
