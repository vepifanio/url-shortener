# URL Shortener - Feature Roadmap

> Structured reference for future development. Organized by category with priority and complexity estimates.

---

## 📋 Legend

| Priority   | Meaning                                                  |
| ---------- | -------------------------------------------------------- |
| **High**   | Core value, competitive advantage, or production blocker |
| **Medium** | Significant improvement, nice-to-have for v1             |
| **Low**    | Polish, future-proofing, or niche use cases              |

| Complexity | Meaning                                       |
| ---------- | --------------------------------------------- |
| **Easy**   | < 1 day, minimal new dependencies, low risk   |
| **Medium** | 1-3 days, some new infrastructure or logic    |
| **Hard**   | > 3 days, architectural changes, new services |

---

## 🎯 Core Functionality

| Feature                              | Description                                                                                                                                 | Priority | Complexity |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **Custom Short Codes**               | Allow users to specify custom slugs (e.g., `myshort.ly/brand`) instead of random nanoids. Validate uniqueness, reserve words.               | High     | Easy       |
| **URL Expiration / TTL**             | Optional expiry date per URL. Background job to clean up expired links. Configurable default TTL.                                           | High     | Medium     |
| **Bulk URL Creation**                | API endpoint to create multiple short URLs in one request (`POST /api/short/bulk`). Returns array of results with per-item success/failure. | Medium   | Easy       |
| **URL Editing (Destination Update)** | Allow updating the `originalUrl` of an existing short link. Requires auth/ownership. Audit log entry.                                       | Medium   | Medium     |
| **Soft Delete / Archive**            | Mark URLs as inactive without removing from DB. Preserves analytics. `DELETE` returns 204 but keeps record with `deletedAt`.                | Low      | Easy       |
| **Password-Protected Links**         | Optional password on creation. Redirect prompts for password before forwarding. Store bcrypt hash.                                          | Medium   | Medium     |
| **QR Code Generation**               | Return QR code image (PNG/SVG) for each short URL. Query param `?format=qr` or separate endpoint.                                           | Low      | Easy       |

---

## 📊 Analytics & Observability

| Feature                           | Description                                                                                                              | Priority | Complexity |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- | ---------- |
| **Click Analytics API**           | Endpoint `GET /api/analytics/:shortUrlId` returning clicks, referrers, countries, devices, browsers, time-series.        | High     | Medium     |
| **Referrer Tracking**             | Capture `Referer` header on redirect. Store top referrers per URL.                                                       | Medium   | Easy       |
| **UTM Parameter Preservation**    | Forward UTM params (`utm_source`, `utm_medium`, etc.) from short URL to destination automatically.                       | Medium   | Easy       |
| **Geographic / Device Analytics** | Parse `User-Agent` and IP (via GeoIP) on redirect. Aggregate by country, city, device type, OS, browser.                 | Medium   | Medium     |
| **Time-Series Metrics**           | Hourly/daily click buckets for dashboard charts. Pre-aggregate in background job or use MongoDB time-series collections. | Medium   | Medium     |
| **Real-Time WebSocket Updates**   | Push live click events to admin dashboard via WebSocket/SSE.                                                             | Low      | Hard       |
| **Export Analytics**              | CSV/JSON export of analytics data for date range.                                                                        | Low      | Easy       |

---

## ⚡ Performance & Reliability

| Feature                           | Description                                                                                                            | Priority | Complexity |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **Health Check Endpoint**         | `GET /health` with Redis/Mongo connectivity checks, cache hit rate, queue depth. Kubernetes liveness/readiness probes. | High     | Easy       |
| **Structured Logging**            | JSON logs with correlation IDs, log levels (info/warn/error), request context. Integrate with Loki/Datadog.            | High     | Easy       |
| **Metrics Endpoint (Prometheus)** | `/metrics` exposing HTTP latency, cache hit/miss, DB query duration, active connections. Grafana dashboards.           | High     | Easy       |
| **Cache Warming**                 | Pre-populate Redis for top-N URLs on startup/deploy. Configurable via env or admin API.                                | Medium   | Easy       |
| **Read Replicas**                 | Route read queries (`findByShortUrlId`) to MongoDB read replicas. Write to primary.                                    | Medium   | Medium     |
| **Connection Pool Tuning**        | Optimize MongoDB/Redis pool sizes for production load. Monitor pool saturation.                                        | Medium   | Easy       |
| **Circuit Breaker**               | Fail fast when Redis/Mongo unavailable (prevent cascade failures). Return stale cache or degraded response.            | Medium   | Medium     |
| **Request Deduplication**         | Prevent duplicate DB writes for concurrent same-URL creation requests (idempotency key).                               | Low      | Medium     |
| **Graceful Degradation**          | If Redis down, serve from DB with warning log. If DB down, serve from cache (read-only mode).                          | Medium   | Medium     |

---

## 🛡️ Security & Abuse Prevention

| Feature                             | Description                                                                                                       | Priority | Complexity |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **Domain Allowlist / Blocklist**    | Restrict which domains can be shortened. Configurable via env or admin UI. Wildcard support.                      | High     | Easy       |
| **Spam / Phishing Detection**       | Integrate with Google Safe Browsing API, VirusTotal, or PhishTank on URL creation. Reject malicious destinations. | High     | Medium     |
| **Per-User Rate Limits**            | Authenticated tiered limits (free: 100/day, pro: 10k/day). Requires auth system.                                  | High     | Medium     |
| **CAPTCHA on Creation**             | Protect against bot farms. hCaptcha/turnstile integration. Trigger on suspicious patterns.                        | Medium   | Medium     |
| **Audit Logging**                   | Log all create/access/update/delete actions with user ID, IP, timestamp. Immutable store (append-only).           | Medium   | Easy       |
| **Signed / Expiring Redirect URLs** | Generate time-limited, signed redirect URLs (JWT) for sensitive links.                                            | Low      | Medium     |
| **IP Allowlist for Admin**          | Restrict admin endpoints to known IPs.                                                                            | Low      | Easy       |

---

## 👨‍💻 Developer Experience

| Feature                                    | Description                                                                         | Priority | Complexity |
| ------------------------------------------ | ----------------------------------------------------------------------------------- | -------- | ---------- |
| **OpenAPI / Swagger Documentation**        | Auto-generated from Zod schemas + route decorators. Swagger UI at `/docs`.          | High     | Easy       |
| **API Versioning**                         | `/v1/`, `/v2/` routes for backward compatibility. Header-based versioning fallback. | Medium   | Easy       |
| **Integration Test Suite**                 | Testcontainers for MongoDB/Redis in CI. Full request/response cycle tests.          | High     | Medium     |
| **Request/Response Validation Middleware** | Centralized Zod validation with detailed error responses. Already partially done.   | Medium   | Easy       |
| **Database Migrations**                    | Versioned migration system (e.g., `migrate-mongo`) for schema changes.              | Medium   | Medium     |
| **Seed / Fixture Scripts**                 | Deterministic test data for local dev and CI.                                       | Low      | Easy       |
| **GitHub Actions CI/CD**                   | Lint, type-check, test, build, docker push on PR/merge.                             | High     | Easy       |
| **Dependency Scanning**                    | `npm audit`, Dependabot, Snyk for vulnerability alerts.                             | Medium   | Easy       |

---

## 🎯 User Experience

| Feature                        | Description                                                                                  | Priority | Complexity |
| ------------------------------ | -------------------------------------------------------------------------------------------- | -------- | ---------- |
| **Preview Page**               | Intermediate page showing destination URL before redirect (optional, configurable per-link). | Medium   | Medium     |
| **Team / Workspaces**          | Multi-tenant support with isolated namespaces, team billing, role-based access.              | Low      | Hard       |
| **Browser Extension**          | One-click shortening from toolbar, context menu, keyboard shortcut.                          | Low      | Hard       |
| **Custom Domain Support**      | Allow users to bring their own domain (CNAME verification, SSL via Let's Encrypt).           | Low      | Hard       |
| **Link Bundles / Collections** | Group related short URLs. Share bundle as single link.                                       | Low      | Medium     |
| **A/B Testing Redirects**      | Split traffic between multiple destinations with weights.                                    | Low      | Medium     |

---

## 🏗️ Infrastructure & DevOps

| Feature                       | Description                                                            | Priority | Complexity |
| ----------------------------- | ---------------------------------------------------------------------- | -------- | ---------- |
| **Docker Multi-Stage Build**  | Optimize image size. Non-root user. Healthcheck in Dockerfile.         | High     | Easy       |
| **Kubernetes Manifests**      | Deployment, Service, Ingress, HPA, ConfigMap, Secret.                  | Medium   | Medium     |
| **Helm Chart**                | Templated K8s deployment with values.yaml for environments.            | Low      | Medium     |
| **Terraform / Pulumi**        | IaC for MongoDB Atlas, Redis (ElastiCache/Upstash), DNS, CDN.          | Low      | Hard       |
| **CDN / Edge Caching**        | Cloudflare Workers / Vercel Edge for redirect at edge. Sub-ms latency. | Medium   | Hard       |
| **Backup / Restore Strategy** | Automated MongoDB backups, point-in-time recovery, Redis RDB/AOF.      | High     | Medium     |

---

## 📈 Suggested Implementation Order (Quick Wins First)

### Phase 1: Production Hardening (Week 1-2)

1. Health Check Endpoint
2. Structured Logging (JSON + correlation IDs)
3. Prometheus Metrics Endpoint
4. OpenAPI/Swagger Documentation
5. Docker Multi-Stage Build
6. GitHub Actions CI/CD

### Phase 2: Core Value Features (Week 2-4)

7. Custom Short Codes
8. URL Expiration + Cleanup Job
9. Click Analytics API (basic: clicks, referrers, time-series)
10. Domain Allowlist/Blocklist
11. Spam/Phishing Detection (Google Safe Browsing)

### Phase 3: Scale & Security (Week 4-6)

12. Per-User Rate Limits (requires auth)
13. Audit Logging
14. Cache Warming
15. Read Replicas
16. Circuit Breaker

### Phase 4: Polish & Growth (Week 6+)

17. QR Code Generation
18. UTM Parameter Preservation
19. Preview Page
20. Bulk URL Creation
21. API Versioning
22. Integration Test Suite

---

## 🔗 Related Files

- `src/application/use-cases/` — Add new use cases here
- `src/routes/api/` — New API endpoints
- `src/routes/get-original-url.ts` — Redirect logic (analytics, referrer capture)
- `src/database/repositories/CachedUrlsRepository.ts` — Cache decoration pattern
- `src/middlewares/routeLimiter.ts` — Rate limiting extension point

---

## 📝 Notes

- Follow existing **clean architecture**: Entity → Repository Interface → Use Case → Route
- Use **decorator pattern** for cross-cutting concerns (caching, analytics, logging)
- Keep **Zod schemas** as single source of truth for validation + OpenAPI generation
- Prefer **composition over inheritance** for new repository behaviors

---

_Last updated: 2026-06-05_
