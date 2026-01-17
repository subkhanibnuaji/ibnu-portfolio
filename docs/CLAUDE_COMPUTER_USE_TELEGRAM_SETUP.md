# Claude Computer Use - Complete Telegram Bot Setup & Verification

## ⚠️ CRITICAL: BOT TOKEN MUST BE RETRIEVED FROM BOTFATHER

**The previously recorded token is INVALID.** You MUST get the correct token from @BotFather first!

---

## TASK OVERVIEW
1. Get the CORRECT bot token from @BotFather
2. Merge PR to deploy Telegram bot code
3. Set environment variables in Vercel
4. Set webhook and test bot

---

## CREDENTIALS & INFO
- **Bot Username**: `@IbnuGPT_Bot`
- **Bot Link**: `https://t.me/IbnuGPT_Bot`
- **GitHub Repo**: `subkhanibnuaji/ibnu-portfolio`
- **Branch to Merge**: `claude/add-telegram-bot-cP9CN`
- **Production URL**: `https://ibnu-portfolio-ashen.vercel.app`
- **Bot Token**: `⚠️ RETRIEVE FROM BOTFATHER - SEE STEP 0`

---

## STEP 0: GET THE CORRECT BOT TOKEN (MOST IMPORTANT!)

The bot token `8472300010:AAGgFp0I95mj_lYM8dmYJzXGYrQFXd_M-0k` is **INVALID** - Telegram API returns "Unauthorized".

### How to get the correct token:

1. Buka Telegram: `https://web.telegram.org/`
2. Search dan buka chat dengan **@BotFather**
3. Kirim: `/mybots`
4. Pilih bot `@IbnuGPT_Bot`
5. Klik tombol **"API Token"**
6. **COPY token yang ditampilkan** (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Jika token tidak berfungsi:
1. Di menu bot @BotFather, klik **"Revoke current token"**
2. Konfirmasi dengan klik **"Yes"**
3. Copy token baru yang diberikan

### Verifikasi token:
Buka URL ini (ganti `YOUR_TOKEN` dengan token dari BotFather):
```
https://api.telegram.org/botYOUR_TOKEN/getMe
```

**Expected Response** (token VALID):
```json
{"ok":true,"result":{"id":123456789,"is_bot":true,"first_name":"IbnuGPT Bot","username":"IbnuGPT_Bot"}}
```

**Error Response** (token INVALID):
```json
{"ok":false,"error_code":401,"description":"Unauthorized"}
```

⚠️ **JANGAN LANJUT ke step berikutnya sampai token terverifikasi!**

**Screenshot**: Ambil screenshot response getMe yang sukses

---

## STEP 1: MERGE PULL REQUEST DI GITHUB

1. Buka: `https://github.com/subkhanibnuaji/ibnu-portfolio/pulls`
2. Cari PR dari branch `claude/add-telegram-bot-cP9CN`
3. Jika tidak ada PR, buat baru:
   - Klik "New pull request"
   - Base: `main` ← Compare: `claude/add-telegram-bot-cP9CN`
   - Title: "Add Telegram Bot & Site Navigator Features"
   - Klik "Create pull request"
4. Klik tombol hijau **"Merge pull request"**
5. Klik **"Confirm merge"**
6. Tunggu sampai muncul "Pull request successfully merged"

**Screenshot**: Ambil screenshot setelah merge berhasil

---

## STEP 2: TUNGGU VERCEL DEPLOYMENT

1. Buka: `https://vercel.com/dashboard`
2. Klik project `ibnu-portfolio`
3. Pergi ke tab **"Deployments"**
4. Tunggu deployment terbaru selesai dengan status **"Ready"** (biasanya 2-3 menit)
5. Pastikan ada tanda centang hijau

**PENTING**: Jangan lanjut ke step berikutnya sampai deployment selesai!

**Screenshot**: Ambil screenshot deployment status "Ready"

---

## STEP 3: SET ENVIRONMENT VARIABLE

1. Di Vercel, buka **Settings** → **Environment Variables**
2. **HAPUS** variable `TELEGRAM_BOT_TOKEN` yang lama jika ada
3. **TAMBAH** variable baru:
   - Klik "Add New"
   - Name: `TELEGRAM_BOT_TOKEN`
   - Value: **[PASTE TOKEN YANG VALID DARI STEP 0]**
   - Environments: centang **Production, Preview, Development**
   - Klik "Save"
4. Pastikan `GROQ_API_KEY` sudah ada
5. **WAJIB REDEPLOY**:
   - Pergi ke tab "Deployments"
   - Klik "..." pada deployment teratas
   - Klik "Redeploy"
   - Tunggu hingga selesai

**Screenshot**: Ambil screenshot environment variables

---

## STEP 4: TEST WEBHOOK ENDPOINT

Buka URL ini di browser:
```
https://ibnu-portfolio-ashen.vercel.app/api/telegram/webhook
```

**Expected Response** (JSON):
```json
{
  "status": "ok",
  "endpoint": "/api/telegram/webhook",
  "configuration": {
    "botToken": "configured",
    "groqApiKey": "configured"
  },
  "ready": true
}
```

Jika `botToken` = "missing", kembali ke Step 3.

**Screenshot**: Ambil screenshot response JSON

---

## STEP 5: SET WEBHOOK VIA TELEGRAM API

**GANTI `YOUR_TOKEN` dengan token yang valid dari Step 0!**

Buka URL ini di browser:
```
https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://ibnu-portfolio-ashen.vercel.app/api/telegram/webhook
```

**Expected Response**:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

Jika error "Unauthorized", token salah - kembali ke Step 0.

**Screenshot**: Ambil screenshot response

---

## STEP 6: VERIFIKASI WEBHOOK

**GANTI `YOUR_TOKEN` dengan token yang valid!**

```
https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo
```

**Expected Response**:
```json
{
  "ok": true,
  "result": {
    "url": "https://ibnu-portfolio-ashen.vercel.app/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

Pastikan `"url"` berisi webhook URL yang benar!

**Screenshot**: Ambil screenshot response

---

## STEP 7: TEST BOT DI TELEGRAM

1. Buka: `https://web.telegram.org/` atau app Telegram
2. Search: `@IbnuGPT_Bot` atau buka `https://t.me/IbnuGPT_Bot`
3. Klik **"Start"** atau kirim `/start`

**Expected Response dari Bot**:
```
👋 Hello [Nama Anda]!

Welcome to IbnuGPT Bot - Your AI assistant powered by Groq LLMs.
...
```

4. Test chat: Kirim `Halo, siapa kamu?`
5. Bot harus merespon dengan AI answer
6. Test `/model` - harus muncul inline keyboard
7. Test `/help` dan `/about`

**Screenshot**: Ambil screenshot conversation dengan bot

---

## TROUBLESHOOTING

### "Unauthorized" error saat set webhook:
1. **TOKEN SALAH** - Ini masalah utama!
2. Kembali ke Step 0, dapatkan token yang benar dari @BotFather
3. Verifikasi dengan getMe sebelum lanjut

### Bot tidak merespon sama sekali:
1. Cek webhook info - pastikan URL benar
2. Cek Vercel function logs untuk error
3. Delete webhook dan set ulang:
   ```
   https://api.telegram.org/botYOUR_TOKEN/deleteWebhook
   ```

### Bot merespon tapi error:
1. Cek GROQ_API_KEY di Vercel environment
2. Lihat Vercel function logs untuk detail

### Response "Bot not configured":
1. TELEGRAM_BOT_TOKEN belum di-set atau SALAH
2. Redeploy Vercel setelah update env var

---

## VERIFICATION CHECKLIST

- [ ] Token dari BotFather terverifikasi (getMe returns ok:true)
- [ ] PR merged ke main
- [ ] Vercel deployment status "Ready"
- [ ] TELEGRAM_BOT_TOKEN set dengan token YANG BENAR
- [ ] Webhook endpoint returns `"ready": true`
- [ ] setWebhook returns `"ok": true`
- [ ] getWebhookInfo shows correct URL
- [ ] Bot responds to `/start`
- [ ] Bot responds to chat message with AI answer
- [ ] Bot responds to `/model` with inline keyboard

---

## FINAL REPORT FORMAT

```
✅ STEP 0: Token Verified - getMe returns ok:true [screenshot]
✅ STEP 1: PR Merged [screenshot]
✅ STEP 2: Vercel Deployed [screenshot]
✅ STEP 3: Env Vars Set [screenshot]
✅ STEP 4: Webhook Endpoint OK [screenshot]
✅ STEP 5: Webhook Set [screenshot]
✅ STEP 6: Webhook Verified [screenshot]
✅ STEP 7: Bot Test Results:
   - /start: ✅ Working
   - Chat: ✅ AI responds
   - /model: ✅ Shows keyboard
   - /help: ✅ Working
   [screenshot conversation]

🎉 TELEGRAM BOT FULLY OPERATIONAL!
```

---

## QUICK URLs (Replace YOUR_TOKEN!)

| Action | URL |
|--------|-----|
| GitHub PRs | https://github.com/subkhanibnuaji/ibnu-portfolio/pulls |
| Vercel Dashboard | https://vercel.com/dashboard |
| Bot Link | https://t.me/IbnuGPT_Bot |
| BotFather | https://t.me/BotFather |
| **Verify Token** | https://api.telegram.org/botYOUR_TOKEN/getMe |
| Webhook Health | https://ibnu-portfolio-ashen.vercel.app/api/telegram/webhook |
| Test Endpoint | https://ibnu-portfolio-ashen.vercel.app/api/telegram/test |
| Set Webhook | https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://ibnu-portfolio-ashen.vercel.app/api/telegram/webhook |
| Webhook Info | https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo |
| Delete Webhook | https://api.telegram.org/botYOUR_TOKEN/deleteWebhook |

---

## TEST ENDPOINT

After deployment, test bot configuration at:
```
https://ibnu-portfolio-ashen.vercel.app/api/telegram/test
```

This shows:
- Environment variable status
- Bot info from Telegram API
- Webhook status and any errors

---

## CRITICAL NOTES

1. **Token `8472300010:AAGgFp0I95mj_lYM8dmYJzXGYrQFXd_M-0k` is INVALID**
2. You MUST get the correct token from @BotFather before proceeding
3. If getMe returns "Unauthorized", the token is wrong
4. Always verify token with getMe first before setting webhook
5. After adding env var in Vercel, ALWAYS redeploy
