# 📡 API Documentation

SiterSyn API reference для всех endpoints.

## Authentication

Все API endpoints (кроме публичных) требуют аутентификации через Supabase Auth.

**Headers:**
```
Authorization: Bearer <supabase_access_token>
```

## Endpoints

### Generation API

#### POST `/api/generate`

Генерирует новый сайт из текстового промпта.

**Request:**
```json
{
  "prompt": "Create a minimalist landing page for a SaaS product"
}
```

**Response (200):**
```json
{
  "site": {
    "id": "uuid",
    "title": "Create a minimalist landing page",
    "slug": "site-1234567890-abc",
    "code": "export default function...",
    "toon_spec": "lp{st:min|s:[h{ly:ctr}|f{ly:gr3}]}",
    "status": "draft",
    "created_at": "2025-11-17T10:00:00Z"
  },
  "toon": "lp{st:min|s:[h{ly:ctr}|f{ly:gr3}]}",
  "confidence": 0.85,
  "method": "template",
  "cached": false,
  "cost": 0.0,
  "savings": 0.08
}
```

**Errors:**
- `401` - Unauthorized (not logged in)
- `402` - Insufficient credits
- `400` - Invalid prompt (confidence < 0.5)
- `429` - Rate limit exceeded
- `500` - Internal server error

---

#### POST `/api/iterate`

Итеративно модифицирует существующий сайт.

**Request:**
```json
{
  "siteId": "uuid",
  "instruction": "Make the hero section larger and add a gradient background"
}
```

**Response (200):**
```json
{
  "site": {
    "id": "uuid",
    "code": "export default function...",
    "updated_at": "2025-11-17T10:05:00Z"
  },
  "cost": 0.05
}
```

**Errors:**
- `401` - Unauthorized
- `402` - Insufficient credits
- `404` - Site not found
- `403` - Site belongs to another user
- `500` - Internal server error

---

### Sites API

#### GET `/api/sites`

Получить все сайты текущего пользователя.

**Query Parameters:**
- `status` (optional): `draft` | `published`
- `limit` (optional): number, default 20
- `offset` (optional): number, default 0

**Response (200):**
```json
{
  "sites": [
    {
      "id": "uuid",
      "title": "My Landing Page",
      "slug": "site-123",
      "thumbnail_url": "https://...",
      "status": "published",
      "created_at": "2025-11-17T10:00:00Z",
      "published_at": "2025-11-17T11:00:00Z"
    }
  ],
  "total": 5
}
```

---

#### GET `/api/sites/[id]`

Получить конкретный сайт по ID.

**Response (200):**
```json
{
  "site": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My Landing Page",
    "slug": "site-123",
    "code": "export default function...",
    "toon_spec": "lp{st:min|s:[...]}",
    "status": "published",
    "custom_domain": null,
    "created_at": "2025-11-17T10:00:00Z",
    "updated_at": "2025-11-17T11:00:00Z"
  }
}
```

**Errors:**
- `404` - Site not found
- `403` - Unauthorized access

---

#### PUT `/api/sites/[id]`

Обновить сайт.

**Request:**
```json
{
  "title": "New Title",
  "status": "published"
}
```

**Response (200):**
```json
{
  "site": {
    "id": "uuid",
    "title": "New Title",
    "status": "published",
    "updated_at": "2025-11-17T12:00:00Z"
  }
}
```

---

#### DELETE `/api/sites/[id]`

Удалить сайт.

**Response (200):**
```json
{
  "success": true
}
```

---

### Credits API

#### GET `/api/credits`

Получить баланс кредитов пользователя.

**Response (200):**
```json
{
  "credits": 15,
  "tier": "pro"
}
```

---

#### POST `/api/credits`

Добавить кредиты (admin only).

**Request:**
```json
{
  "userId": "uuid",
  "amount": 10,
  "description": "Bonus credits"
}
```

**Response (200):**
```json
{
  "newBalance": 25
}
```

---

#### GET `/api/credits/transactions`

Получить историю транзакций кредитов.

**Query Parameters:**
- `limit` (optional): number, default 20
- `offset` (optional): number, default 0

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "amount": -1,
      "type": "generation",
      "description": "Site generation",
      "created_at": "2025-11-17T10:00:00Z"
    },
    {
      "id": "uuid",
      "amount": 50,
      "type": "subscription",
      "description": "Pro plan subscription via Stripe",
      "created_at": "2025-11-17T09:00:00Z"
    }
  ],
  "total": 15
}
```

---

### Payment API

#### POST `/api/checkout`

Создать Stripe или YooKassa checkout session.

**Request:**
```json
{
  "tier": "pro",
  "provider": "stripe"
}
```

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Errors:**
- `401` - Unauthorized
- `400` - Invalid tier or provider
- `500` - Payment provider error

---

### Webhooks

#### POST `/api/webhooks/stripe`

Stripe webhook endpoint (internal use only).

**Events handled:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Signature verification:** Required via `stripe-signature` header

---

#### POST `/api/webhooks/yookassa`

YooKassa webhook endpoint (internal use only).

**Events handled:**
- `payment.succeeded`
- `payment.canceled`
- `refund.succeeded`

**Signature verification:** Optional via `x-yookassa-signature` header

---

### Analytics API

#### GET `/api/analytics`

Получить метрики платформы (admin only).

**Response (200):**
```json
{
  "totalGenerations": 1250,
  "totalUsers": 350,
  "cacheHitRate": 0.42,
  "averageCost": 0.032,
  "totalRevenue": 2850,
  "activeSubscriptions": 45,
  "generationsByMethod": {
    "template": 520,
    "hybrid": 430,
    "ai": 300
  }
}
```

---

### Cron Jobs

#### GET `/api/cron/warm-cache`

Прогрев кэша для популярных паттернов (internal use only).

**Headers:**
```
Authorization: Bearer <CRON_SECRET>
```

**Response (200):**
```json
{
  "success": true,
  "warmed": 8,
  "total": 10
}
```

---

#### GET `/api/cron/cleanup`

Очистка старых данных (internal use only).

**Headers:**
```
Authorization: Bearer <CRON_SECRET>
```

**Response (200):**
```json
{
  "success": true,
  "deleted": {
    "sites": 15,
    "transactions": 234,
    "generations": 156
  }
}
```

---

## Rate Limits

Rate limits применяются на уровне middleware:

| Tier | Generations/hour |
|------|-----------------|
| Free | 3 |
| Starter | 15 |
| Pro | 50 |
| Business | Unlimited |

**Response при превышении лимита:**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```

**Status Code:** `429 Too Many Requests`

---

## TOON Format

TOON (Tiny Object Notation) - компактный формат для описания структуры сайта.

**Формат:**
```
{siteType}{st:{style}|s:[{sections}]}
```

**Пример:**
```
lp{st:min|s:[h{ly:ctr}|f{ly:gr3}|ct]}
```

**Расшифровка:**
- `lp` - landing page
- `st:min` - minimalist style
- `h{ly:ctr}` - hero section, centered layout
- `f{ly:gr3}` - features section, 3-column grid
- `ct` - contact section

**Site Types:**
- `lp` - Landing Page
- `pf` - Portfolio
- `ec` - E-commerce
- `bl` - Blog

**Styles:**
- `min` - Minimalist
- `cor` - Corporate
- `cre` - Creative
- `mod` - Modern

**Section Types:**
- `h` - Hero
- `f` - Features
- `g` - Gallery
- `ct` - Contact
- `ft` - Footer
- `nav` - Navigation
- `pr` - Pricing
- `tm` - Testimonials

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 402 | Payment Required - Insufficient credits |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Temporary issue |

---

## Webhooks Setup

### Stripe

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### YooKassa

1. Go to YooKassa Dashboard → Settings → Webhooks
2. Add URL: `https://yourdomain.com/api/webhooks/yookassa`
3. Enable events:
   - `payment.succeeded`
   - `payment.canceled`
   - `refund.succeeded`

---

## SDK / Client Libraries

JavaScript/TypeScript client example:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate site
async function generateSite(prompt: string) {
  const { data: { session } } = await supabase.auth.getSession()

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({ prompt })
  })

  return await response.json()
}
```

---

## Testing

### Using curl:

```bash
# Get credits
curl -X GET https://yourdomain.com/api/credits \
  -H "Authorization: Bearer YOUR_TOKEN"

# Generate site
curl -X POST https://yourdomain.com/api/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a landing page"}'

# Get all sites
curl -X GET https://yourdomain.com/api/sites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support

For API issues or questions:
- GitHub Issues: [https://github.com/yourorg/sitersyn/issues](https://github.com/yourorg/sitersyn/issues)
- Email: support@yourdomain.com
