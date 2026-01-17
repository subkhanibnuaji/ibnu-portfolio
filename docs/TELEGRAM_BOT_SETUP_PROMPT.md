# Claude Computer Use / Claude for Chrome - Telegram Bot Setup Prompt

Copy-paste prompt ini ke Claude for Computer Use atau Claude for Chrome extension untuk setup otomatis.

---

## PROMPT (Copy This)

```
# Task: Setup Telegram Bot for Ibnu Portfolio

Saya ingin kamu membantu setup Telegram Bot untuk portfolio website saya secara otomatis. Ikuti langkah-langkah berikut dengan teliti:

## PART 1: Create Telegram Bot via @BotFather

1. Buka Telegram Web di browser: https://web.telegram.org/
2. Login dengan akun Telegram saya (jika belum login)
3. Search dan buka chat dengan @BotFather
4. Kirim pesan: /newbot
5. Ketika ditanya nama bot, kirim: IbnuGPT Bot
6. Ketika ditanya username bot, kirim: IbnuGPT_Bot (atau jika sudah taken, coba: IbnuGPT_Portfolio_Bot atau IbnuGPT_AI_Bot)
7. PENTING: Copy dan simpan Bot Token yang diberikan BotFather (format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)
8. Kirim pesan ke BotFather: /setdescription
9. Pilih bot yang baru dibuat
10. Kirim deskripsi: AI-powered chatbot for Ibnu's Portfolio. Chat with IbnuGPT powered by Groq LLMs. Supports Indonesian and English.
11. Kirim pesan: /setabouttext
12. Pilih bot yang baru dibuat
13. Kirim: AI chatbot powered by Groq LLMs. Part of ibnuaji.my.id portfolio.
14. Kirim pesan: /setcommands
15. Pilih bot yang baru dibuat
16. Kirim:
start - Start the bot and see welcome message
help - Get help and usage tips
clear - Clear conversation history
model - Change AI model
about - About this bot

## PART 2: Setup Environment Variable di Vercel

1. Buka Vercel Dashboard: https://vercel.com/dashboard
2. Login jika belum
3. Cari dan klik project: ibnu-portfolio (atau nama project yang sesuai)
4. Klik tab "Settings" di navigation bar
5. Di sidebar kiri, klik "Environment Variables"
6. Tambah variable baru:
   - Name: TELEGRAM_BOT_TOKEN
   - Value: [paste token dari BotFather tadi]
   - Environment: Production, Preview, Development (centang semua)
7. Klik "Save"
8. PENTING: Klik "Redeploy" untuk apply perubahan:
   - Pergi ke tab "Deployments"
   - Klik "..." pada deployment teratas
   - Klik "Redeploy"
   - Tunggu hingga deployment selesai (status: Ready)

## PART 3: Set Webhook

1. Buka halaman Telegram Bot setup: https://ibnu-portfolio-ashen.vercel.app/ai-tools/telegram-bot
   (atau domain production yang sesuai)
2. Tunggu halaman loading selesai
3. Cek status:
   - Bot Token: should show "configured" (hijau)
   - Groq API Key: should show "configured" (hijau)
   - Webhook: might show "not set" (kuning)
4. Klik tombol "Set Webhook" (tombol biru dengan icon webhook)
5. Tunggu hingga muncul notifikasi "Webhook set successfully"
6. Verify:
   - Webhook status should now show "active" (hijau)
   - Bot username should appear with link

## PART 4: Test Bot

1. Klik tombol "Open Bot" atau buka link: https://t.me/[username_bot]
2. Di Telegram, klik "Start" atau kirim /start
3. Bot harus merespon dengan welcome message
4. Test kirim pesan: "Hello, what can you do?"
5. Bot harus merespon dengan AI-generated answer
6. Test command: /model
7. Bot harus menampilkan pilihan model dengan inline keyboard
8. Pilih salah satu model, misal "Llama 3.3 70B"
9. Bot harus konfirmasi perubahan model

## VERIFICATION CHECKLIST

Pastikan semua ini berhasil:
- [ ] Bot created di @BotFather dengan username
- [ ] Bot token disimpan di Vercel environment variables
- [ ] Vercel sudah di-redeploy setelah add env variable
- [ ] Webhook berhasil di-set (status hijau)
- [ ] Bot merespon /start command
- [ ] Bot bisa chat dengan AI response
- [ ] /model command menampilkan pilihan model

## TROUBLESHOOTING

Jika ada error:
1. "Bot not configured" → Cek TELEGRAM_BOT_TOKEN di Vercel
2. "Webhook failed" → Pastikan deployment sudah selesai, coba set webhook lagi
3. "Bot not responding" → Cek webhook status, pastikan URL benar
4. "AI error" → Cek GROQ_API_KEY sudah ada di Vercel

## NOTES

- Bot token RAHASIA, jangan share ke siapapun
- Webhook URL harus HTTPS (Vercel sudah HTTPS)
- Bot gratis menggunakan Groq API
- Conversation history disimpan per chat (max 20 messages)

Setelah selesai, report back status masing-masing step dan screenshot hasil test bot.
```

---

## Alternative: Shorter Prompt

```
Setup Telegram Bot untuk portfolio saya:

1. TELEGRAM: Buka web.telegram.org → Chat @BotFather → /newbot → Nama: "IbnuGPT Bot" → Username: "IbnuGPT_Bot" → Copy token

2. VERCEL: Buka vercel.com → Project ibnu-portfolio → Settings → Environment Variables → Add TELEGRAM_BOT_TOKEN dengan value token tadi → Save → Redeploy

3. WEBHOOK: Buka https://ibnu-portfolio-ashen.vercel.app/ai-tools/telegram-bot → Klik "Set Webhook"

4. TEST: Buka bot di Telegram → /start → Kirim pesan test

Report status setiap langkah.
```

---

## For MCP Server / Automation

```json
{
  "task": "setup_telegram_bot",
  "steps": [
    {
      "name": "create_bot",
      "action": "telegram_botfather",
      "commands": [
        "/newbot",
        "IbnuGPT Bot",
        "IbnuGPT_Bot",
        "/setdescription -> AI chatbot for Ibnu Portfolio",
        "/setcommands -> start,help,clear,model,about"
      ],
      "output": "bot_token"
    },
    {
      "name": "set_env_var",
      "action": "vercel_dashboard",
      "project": "ibnu-portfolio",
      "variables": {
        "TELEGRAM_BOT_TOKEN": "${bot_token}"
      },
      "redeploy": true
    },
    {
      "name": "set_webhook",
      "action": "http_request",
      "method": "POST",
      "url": "https://ibnu-portfolio-ashen.vercel.app/api/telegram/setup",
      "body": {
        "action": "setWebhook",
        "webhookUrl": "https://ibnu-portfolio-ashen.vercel.app/api/telegram/webhook"
      }
    },
    {
      "name": "verify",
      "action": "telegram_send",
      "to": "@IbnuGPT_Bot",
      "message": "/start"
    }
  ]
}
```

---

## Direct API Setup (If Bot Token Already Known)

Jika sudah punya bot token, bisa langsung set webhook via curl:

```bash
# Replace YOUR_BOT_TOKEN with actual token
# Replace YOUR_DOMAIN with your Vercel domain

curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_DOMAIN/api/telegram/webhook",
    "allowed_updates": ["message", "callback_query"]
  }'
```

---

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Token dari @BotFather | Yes |
| `GROQ_API_KEY` | API key dari Groq (sudah ada) | Yes |
| `TELEGRAM_WEBHOOK_SECRET` | Optional security token | No |

---

## Success Indicators

Setelah setup berhasil, halaman `/ai-tools/telegram-bot` akan menampilkan:

- ✅ Bot Token: configured
- ✅ Groq API Key: configured
- ✅ Webhook: active
- ✅ Bot Info: @YourBotUsername

Dan bot akan bisa:
- Respond to /start with welcome message
- Chat using Groq LLMs
- Change models via /model command
- Clear history via /clear command
