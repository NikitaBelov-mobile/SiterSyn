# 🚀 Deployment Guide

Руководство по развертыванию SiterSyn в production.

## Предварительные требования

Перед деплоем убедитесь, что у вас есть:

- [ ] GitHub аккаунт
- [ ] Vercel аккаунт
- [ ] Supabase проект
- [ ] Anthropic API key
- [ ] Upstash Redis database
- [ ] Stripe аккаунт
- [ ] YooKassa аккаунт (опционально для российского рынка)
- [ ] Sentry аккаунт (опционально для мониторинга)

## 1. Подготовка базы данных (Supabase)

### 1.1 Создание проекта

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Сохраните URL и anon key

### 1.2 Выполнение миграций

Выполните SQL из файла `supabase/migrations/001_initial_schema.sql` в SQL Editor:

```sql
-- Tables creation
-- RLS policies
-- Functions
```

### 1.3 Настройка Storage

1. Создайте bucket `site-thumbnails` (public)
2. Создайте bucket `user-uploads` (private)

### 1.4 Настройка Auth

1. Включите Email/Password auth
2. Настройте Google OAuth (опционально)
3. Установите redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (для dev)

## 2. Настройка Redis (Upstash)

1. Создайте Redis database на [upstash.com](https://upstash.com)
2. Скопируйте REST URL и Token
3. Рекомендуемые настройки:
   - Region: выберите ближайший к вашим пользователям
   - Eviction: allkeys-lru
   - Max memory: минимум 256MB

## 3. Настройка Stripe

### 3.1 Создание продуктов

1. Зайдите в Stripe Dashboard → Products
2. Создайте 3 продукта:
   - **Starter**: $15/month recurring
   - **Pro**: $29/month recurring
   - **Business**: $79/month recurring

3. Скопируйте Price IDs для каждого продукта

### 3.2 Настройка webhooks

1. Stripe Dashboard → Developers → Webhooks
2. Добавьте endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Выберите события:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Скопируйте webhook secret

## 4. Настройка YooKassa (для России)

1. Зарегистрируйте магазин на [yookassa.ru](https://yookassa.ru)
2. Получите Shop ID и Secret Key
3. Настройте webhook: `https://yourdomain.com/api/webhooks/yookassa`
4. Выберите события:
   - `payment.succeeded`
   - `payment.canceled`
   - `refund.succeeded`

## 5. Настройка Sentry (опционально)

1. Создайте проект на [sentry.io](https://sentry.io)
2. Скопируйте DSN
3. Настройте alerts для критичных ошибок

## 6. Деплой на Vercel

### 6.1 Подключение GitHub

1. Зайдите на [vercel.com](https://vercel.com)
2. Import Git Repository
3. Выберите ваш репозиторий

### 6.2 Настройка Environment Variables

В Vercel Dashboard → Settings → Environment Variables добавьте:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...

# YooKassa (опционально)
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=live_...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Sentry (опционально)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Cron Secret
CRON_SECRET=generate_random_secret_here

# Environment
NODE_ENV=production
```

### 6.3 Deploy

1. Нажмите Deploy
2. Дождитесь завершения билда
3. Проверьте deployment на временном URL

## 7. Настройка домена

1. Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS согласно инструкциям Vercel
4. Обновите `NEXT_PUBLIC_APP_URL` в environment variables
5. Обновите redirect URLs в Supabase Auth

## 8. Настройка Cron Jobs

Cron jobs настраиваются автоматически из `vercel.json`:

- **Cache Warming**: каждые 30 минут
- **Cleanup**: ежедневно в 2 AM

Для дополнительной защиты, в Vercel Dashboard добавьте:
1. Settings → Environment Variables
2. Добавьте `Authorization` header в cron запросы

## 9. Проверка деплоя

### 9.1 Тестирование функциональности

- [ ] Регистрация нового пользователя
- [ ] Email confirmation
- [ ] Генерация сайта
- [ ] Preview работает корректно
- [ ] Итеративное редактирование
- [ ] Checkout flow (Stripe)
- [ ] Webhook получены корректно
- [ ] Credits начисляются после оплаты
- [ ] Subscription management работает

### 9.2 Проверка производительности

```bash
# Lighthouse audit
npx lighthouse https://yourdomain.com --view

# Load testing (опционально)
npx artillery quick --count 10 -n 20 https://yourdomain.com
```

### 9.3 Мониторинг

1. Vercel Analytics - трафик и производительность
2. Sentry - ошибки и warnings
3. Stripe Dashboard - платежи
4. Supabase Dashboard - database usage

## 10. Post-Deploy настройки

### 10.1 SEO

1. Настройте `robots.txt`
2. Добавьте `sitemap.xml`
3. Проверьте Open Graph meta tags
4. Настройте Google Analytics (опционально)

### 10.2 Security

1. Включите CORS только для вашего домена
2. Проверьте RLS policies в Supabase
3. Ротация API keys (рекомендуется каждые 90 дней)
4. Настройте rate limiting (уже реализовано в middleware)

### 10.3 Backup Strategy

1. Supabase - автоматические бэкапы включены
2. Регулярный экспорт важных данных
3. Настройте monitoring alerts

## 11. Troubleshooting

### Проблема: "Unauthorized" при генерации

**Решение**: Проверьте Supabase auth cookies и RLS policies

### Проблема: Stripe webhook не работает

**Решение**:
1. Проверьте webhook secret
2. Проверьте endpoint URL
3. Проверьте логи в Stripe Dashboard

### Проблема: Redis connection errors

**Решение**:
1. Проверьте URL и Token
2. Проверьте квоты Upstash
3. Проверьте network connectivity

### Проблема: High costs

**Решение**:
1. Проверьте cache hit rate в `/dashboard/analytics`
2. Проверьте TOON encoding работает корректно
3. Увеличьте использование templates

## 12. Масштабирование

### При росте до 1000+ пользователей:

1. **Database**: Upgrade Supabase plan для connection pooling
2. **Redis**: Увеличьте max memory
3. **Vercel**: Upgrade для увеличения Edge function limits
4. **CDN**: Настройте Cloudflare для дополнительного кэширования

### При росте до 10,000+ пользователей:

1. Рассмотрите dedicated Redis instance
2. Рассмотрите read replicas для Supabase
3. Настройте horizontal scaling для generation workers
4. Рассмотрите queue system (QStash или BullMQ)

## 13. Мониторинг метрик

### Ключевые метрики для отслеживания:

1. **Performance**:
   - P95 latency генерации
   - Cache hit rate
   - API response times

2. **Business**:
   - Conversion rate (free → paid)
   - Churn rate
   - MRR (Monthly Recurring Revenue)

3. **Technical**:
   - Error rate
   - Uptime
   - Database connections
   - Redis memory usage

## 14. Обновления

### Стратегия обновлений:

1. Тестируйте в preview deployment
2. Проверяйте critical paths
3. Deploy в production
4. Мониторьте логи первые 30 минут
5. Rollback если критичные ошибки

### Автоматический rollback:

Vercel автоматически откатывается если:
- Build fails
- Health check fails

---

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs/payments)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)

## Поддержка

При проблемах с деплоем:
1. Проверьте логи в Vercel
2. Проверьте Sentry errors
3. Создайте issue в GitHub
