#!/bin/bash
# Telegram Bot Token Verification Script
# Usage: ./verify-telegram-token.sh YOUR_BOT_TOKEN

TOKEN="$1"

if [ -z "$TOKEN" ]; then
    echo "❌ Usage: ./verify-telegram-token.sh YOUR_BOT_TOKEN"
    echo ""
    echo "Example: ./verify-telegram-token.sh 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
    echo ""
    echo "How to get your token:"
    echo "1. Open Telegram and chat with @BotFather"
    echo "2. Send /mybots"
    echo "3. Select your bot"
    echo "4. Click 'API Token' to see your token"
    echo "   OR click 'Revoke current token' then 'Yes' to get a new one"
    exit 1
fi

echo "🔍 Verifying Telegram Bot Token..."
echo "Token: ${TOKEN:0:15}...${TOKEN: -10}"
echo ""

# Test getMe API
RESPONSE=$(curl -s "https://api.telegram.org/bot${TOKEN}/getMe")

# Check if response contains "ok": true
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "✅ Token is VALID!"
    echo ""
    echo "Bot Info:"
    echo "$RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
result = data.get('result', {})
print(f\"  ID: {result.get('id')}\")
print(f\"  Username: @{result.get('username')}\")
print(f\"  Name: {result.get('first_name')}\")
print(f\"  Link: https://t.me/{result.get('username')}\")
" 2>/dev/null || echo "$RESPONSE"

    echo ""
    echo "📋 Next steps:"
    echo "1. Set this token in Vercel Environment Variables:"
    echo "   TELEGRAM_BOT_TOKEN=${TOKEN}"
    echo ""
    echo "2. Set webhook (replace YOUR_DOMAIN):"
    echo "   curl \"https://api.telegram.org/bot${TOKEN}/setWebhook?url=https://YOUR_DOMAIN/api/telegram/webhook\""
else
    echo "❌ Token is INVALID!"
    echo ""
    echo "Response: $RESPONSE"
    echo ""
    echo "🔧 How to fix:"
    echo "1. Open Telegram and chat with @BotFather"
    echo "2. Send /mybots"
    echo "3. Select @IbnuGPT_Bot (or your bot)"
    echo "4. Click 'API Token' to see the correct token"
    echo "   If you think the token was compromised, click 'Revoke current token'"
    echo ""
    echo "Common issues:"
    echo "- Token copied incorrectly (missing characters)"
    echo "- Extra spaces or newlines in token"
    echo "- Bot was deleted or token was revoked"
fi
