# Security Policy

## 🔒 Overview

This document outlines the security measures implemented in this application and provides guidelines for security researchers.

## 🛡️ Security Features

### Multi-Layer Protection

| Layer | Protection | Status |
|-------|------------|--------|
| **Edge** | Cloudflare DDoS protection | Recommended |
| **Middleware** | Rate limiting, bot detection | ✅ Active |
| **API** | Input validation, sanitization | ✅ Active |
| **Database** | Prisma ORM (SQL injection safe) | ✅ Active |
| **Auth** | NextAuth with bcrypt, JWT | ✅ Active |

### DDoS Protection

- Rate limiting: 50 requests/second, 300 requests/minute per IP
- Auto-blocking after threshold exceeded
- Cloudflare integration supported

### Attack Prevention

| Attack Type | Protection Method |
|-------------|-------------------|
| SQL Injection | Prisma ORM + pattern detection |
| XSS | Input sanitization + CSP headers |
| CSRF | Token validation + SameSite cookies |
| Brute Force | Login rate limiting + account lockout |
| Path Traversal | Pattern detection + blocking |
| Clickjacking | X-Frame-Options: DENY |
| MIME Sniffing | X-Content-Type-Options: nosniff |

### Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: [comprehensive policy]
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

## 🔐 Authentication

- Passwords hashed with bcrypt (12 rounds)
- JWT-based sessions
- Role-based access control (RBAC)
- Session expiration and refresh
- Secure cookie settings

## 📝 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow responsible disclosure:

### Contact

- **Email:** security@heyibnu.com
- **GitHub:** [Security Advisories](https://github.com/subkhanibnuaji/ibnu-portfolio/security/advisories/new)
- **security.txt:** https://heyibnu.com/.well-known/security.txt

### What to Include

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

### Response Timeline

| Phase | Timeline |
|-------|----------|
| Acknowledgment | 24-48 hours |
| Initial Assessment | 3-5 days |
| Fix Development | 7-14 days |
| Public Disclosure | After fix deployed |

### Recognition

Security researchers who responsibly disclose vulnerabilities will be:
- Credited on our security thanks page
- Given early access to fixes
- Potentially eligible for swag/rewards

## 🚫 Out of Scope

The following are NOT considered vulnerabilities:

- Rate limiting on public endpoints (by design)
- Missing security headers on development/localhost
- Clickjacking on pages without sensitive actions
- Content injection via user-controlled data (intended features)
- CSRF on logout endpoints
- Vulnerabilities in third-party services

## 📋 Security Checklist

### For Developers

- [ ] All user input validated with Zod schemas
- [ ] SQL queries use Prisma ORM (no raw queries)
- [ ] Sensitive data not logged
- [ ] Environment variables for secrets
- [ ] Dependencies regularly updated
- [ ] Security headers configured
- [ ] HTTPS enforced in production

### For Deployment

- [ ] Cloudflare DNS proxy enabled
- [ ] WAF rules configured
- [ ] Rate limiting active
- [ ] Error monitoring (Sentry) configured
- [ ] Uptime monitoring configured
- [ ] Backup strategy in place
- [ ] Incident response plan documented

## 🔧 Security Configuration

### Environment Variables

```env
# Authentication
AUTH_SECRET=<32+ character secret>

# CAPTCHA (Cloudflare Turnstile - FREE)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Rate Limiting (Upstash Redis - FREE)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Error Monitoring (Sentry - FREE)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

### Recommended Services (All Free Tiers)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Cloudflare | DDoS, WAF, CDN | Unlimited |
| Upstash | Redis rate limiting | 10K requests/day |
| Sentry | Error monitoring | 5K events/month |
| UptimeRobot | Uptime monitoring | 50 monitors |
| GitHub | Secret scanning | Unlimited |

## 📊 Monitoring

### Security Dashboard

Access at: `/admin/security` (admin only)

Features:
- Real-time threat visualization
- Blocked IPs management
- Threat distribution charts
- Audit logs

### Health Endpoints

- `GET /api/monitoring/health` - Full health check
- `HEAD /api/monitoring/health` - Simple ping
- `GET /api/monitoring/csp-report` - CSP violations

## 🔄 Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | Active exploitation, data breach | Immediate |
| High | Vulnerability with exploit code | 24 hours |
| Medium | Vulnerability, no known exploit | 7 days |
| Low | Minor security improvement | 30 days |

### Response Steps

1. **Contain** - Block attack/IP, disable feature
2. **Assess** - Determine scope and impact
3. **Fix** - Deploy patch
4. **Notify** - Inform affected users
5. **Review** - Post-incident analysis

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/security)
- [NextAuth Security](https://next-auth.js.org/getting-started/introduction#secure-by-default)

---

Last updated: January 2025
