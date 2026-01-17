# Deployment Checklist

## Pre-Deployment Security Checklist

### Environment Variables
- [ ] `AUTH_SECRET` - Strong 32+ character secret
- [ ] `DATABASE_URL` - Production database connection
- [ ] `NEXT_PUBLIC_APP_URL` - Production URL (https://)
- [ ] All secrets removed from code
- [ ] `.env` file not committed to git

### Security Configuration
- [ ] HTTPS enforced
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] CORS properly configured (specific origins, not *)
- [ ] Rate limiting enabled
- [ ] CAPTCHA configured (Turnstile)

### Authentication
- [ ] Admin accounts use strong passwords
- [ ] Default/test accounts removed
- [ ] Session expiration configured
- [ ] Password reset working

### Database
- [ ] Production database secured
- [ ] Database backups configured
- [ ] Connection pooling enabled
- [ ] Prisma migrations applied

---

## Deployment Steps

### 1. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Environment Variables on Vercel

Go to Project Settings → Environment Variables and add:

```
# Required
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
AUTH_SECRET=your-secret-key

# Optional but recommended
NEXT_PUBLIC_APP_URL=https://yourdomain.com
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
SENTRY_DSN=https://...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed data
npx prisma db seed
```

### 4. Domain Configuration

1. Add custom domain in Vercel
2. Update DNS records:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com

### 5. Cloudflare Setup (Recommended)

1. Add site to Cloudflare
2. Update nameservers
3. Configure:
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - Auto Minify: On
   - Brotli: On
   - HTTP/3: On
   - Bot Fight Mode: On

---

## Post-Deployment Checklist

### Functionality
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Authentication working
- [ ] Admin panel accessible

### Security
- [ ] SSL certificate valid
- [ ] Security headers present (check securityheaders.com)
- [ ] No console errors
- [ ] Rate limiting working
- [ ] CAPTCHA working

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Caching working

### Monitoring
- [ ] Sentry connected and receiving events
- [ ] Uptime monitoring configured
- [ ] Analytics working
- [ ] Health endpoint responding

### SEO
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)
- [ ] Meta tags present
- [ ] OG images working
- [ ] Structured data valid (schema.org)

---

## Monitoring URLs

After deployment, verify these endpoints:

| Endpoint | Expected Response |
|----------|-------------------|
| `/` | 200 OK |
| `/api/monitoring/health` | 200 OK with JSON |
| `/sitemap.xml` | Valid XML |
| `/robots.txt` | Text file |
| `/.well-known/security.txt` | Security policy |

---

## Emergency Procedures

### Site Down
1. Check Vercel status page
2. Check Cloudflare status
3. Check database connectivity
4. Review recent deployments
5. Rollback if necessary: `vercel rollback`

### Security Incident
1. Enable Cloudflare "Under Attack Mode"
2. Check `/admin/security` for threats
3. Block suspicious IPs
4. Review audit logs
5. Contact: security@heyibnu.com

### Database Issues
1. Check connection string
2. Verify database is running
3. Check connection pool limits
4. Review Prisma logs

---

## Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback deployment
vercel rollback

# Promote to production
vercel promote [deployment-url]

# Check environment
vercel env ls
```

---

## Performance Optimization

### Vercel Settings
- Edge Functions: Enabled
- Image Optimization: Enabled
- Incremental Static Regeneration: Configured

### Cloudflare Settings
- Caching Level: Standard
- Browser Cache TTL: 4 hours
- Always Online: Enabled
- Rocket Loader: Test before enabling

---

## Support

- **Vercel Issues**: https://vercel.com/support
- **Cloudflare Issues**: https://support.cloudflare.com
- **Project Issues**: https://github.com/subkhanibnuaji/ibnu-portfolio/issues
