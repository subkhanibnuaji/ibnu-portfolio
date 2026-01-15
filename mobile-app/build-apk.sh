#!/bin/bash

# Android APK Build Script for Ibnu Portfolio
# This script helps build an Android APK using Expo EAS

echo "======================================"
echo "  Ibnu Portfolio - Android APK Builder"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    echo "Please install npm (comes with Node.js)"
    exit 1
fi

# Navigate to mobile-app directory
cd "$(dirname "$0")"

echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Installing EAS CLI..."
npm install -g eas-cli

echo ""
echo "Step 3: Checking Expo login status..."
if ! eas whoami &> /dev/null; then
    echo ""
    echo "You are not logged in to Expo."
    echo "Please create an account at: https://expo.dev/signup"
    echo ""
    echo "Then run: eas login"
    echo ""
    read -p "Press Enter after you have logged in..."
fi

echo ""
echo "Step 4: Initializing EAS project..."
eas init --non-interactive || true

echo ""
echo "Step 5: Building Android APK..."
echo "This will take approximately 10-15 minutes."
echo "The APK will be built in Expo's cloud servers."
echo ""

eas build --platform android --profile preview

echo ""
echo "======================================"
echo "  Build Complete!"
echo "======================================"
echo ""
echo "The download link for your APK will be shown above."
echo "You can also find it at: https://expo.dev"
