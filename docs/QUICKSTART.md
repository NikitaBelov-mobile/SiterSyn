# 🚀 Quick Start Guide - AI Site Generator

Краткое руководство для немедленного старта разработки.

---

## ⚡ Быстрый старт (30 минут)

### 1. Клонировать и установить

```bash
npx create-next-app@latest ai-site-generator --typescript --tailwind --app
cd ai-site-generator
npm install @anthropic-ai/sdk @supabase/supabase-js @upstash/redis stripe
```

### 2. Настроить Supabase

1. Создать проект на [supabase.com](https://supabase.com)
2. Запустить SQL из `implementation_plan.md` (секция 1.2)
3. Скопировать URL и API keys

### 3. Настроить переменные окружения

Создать `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
ANTHROPIC_API_KEY=your_claude_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 4. Запустить dev сервер

```bash
npm run dev
```

---

## 📁 Критические файлы для старта

### Приоритет 1 (День 1):
```
lib/
├── ai/toon/dictionary.ts       # TOON словарь
├── ai/toon/encoder.ts          # TOON encoder
├── ai/claude.ts                # Claude API wrapper
└── supabase/client.ts          # Supabase client
```

### Приоритет 2 (День 2-3):
```
app/api/
└── generate/route.ts           # Основной endpoint

components/
├── GenerationPanel/
│   └── PromptInput.tsx
└── Editor/
    └── Preview.tsx
```

### Приоритет 3 (День 4-5):
```
app/
├── dashboard/page.tsx
├── editor/[id]/page.tsx
└── (auth)/login/page.tsx
```

---

## 🎯 MVP в 3 дня (минимальная версия)

### День 1: Core Setup
- ✅ Next.js проект + dependencies
- ✅ Supabase database + auth
- ✅ TOON encoder/decoder
- ✅ Claude API integration

### День 2: Generation
- ✅ API endpoint `/api/generate`
- ✅ Простой промпт input
- ✅ Preview component (iframe)
- ✅ Базовая генерация работает

### День 3: Auth + Deploy
- ✅ Supabase Auth (email/password)
- ✅ Protected routes
- ✅ Deploy на Vercel
- ✅ Тестирование E2E

**Результат**: Работающий прототип для демо.

---

## 💡 Критические концепции

### TOON Encoding

**Зачем**: Сжимает промпты на 67%, снижает стоимость AI.

**Как работает**:
```
Пользователь вводит:
"Create a minimalist landing page with hero and 3 features"

TOON encoder превращает в:
"lp{st:min|s:[h{ly:spl}|f{ly:gr3}]}"

Claude получает компактный запрос:
"Generate React component from TOON: lp{st:min|s:[h{ly:spl}|f{ly:gr3}]}"
```

### Prompt Caching

**Зачем**: System prompt (2000+ tokens) кэшируется с 90% скидкой.

**Реализация**:
```typescript
{
  type: 'text',
  text: systemPrompt,
  cache_control: { type: 'ephemeral' }, // ← Кэш на 5 минут
}
```

### Multi-layer Caching

**3 уровня**:
1. **Prompt Cache** (Claude) - system prompts
2. **Response Cache** (Redis) - готовые генерации
3. **Template Cache** (in-memory) - шаблоны

---

## 🔥 Распространенные ошибки

### ❌ Ошибка 1: Не используют TOON
**Проблема**: Отправляют полный промпт в Claude
**Решение**: Всегда encode → generate → decode

### ❌ Ошибка 2: Забывают про cache_control
**Проблема**: Каждый запрос полная цена
**Решение**: Добавить `cache_control: { type: 'ephemeral' }`

### ❌ Ошибка 3: Нет проверки кредитов
**Проблема**: Пользователи генерят бесконечно
**Решение**: Проверять credits ПЕРЕД генерацией

### ❌ Ошибка 4: Прямой рендер в main page
**Проблема**: XSS уязвимость, untrusted code
**Решение**: Всегда рендерить в sandboxed iframe

### ❌ Ошибка 5: Sync генерация
**Проблема**: UI блокируется на 10-15 секунд
**Решение**: Использовать streaming или polling

---

## 📊 Ключевые метрики для отслеживания

### Development:
```bash
# Средняя стоимость генерации
Target: <$0.10

# Cache hit rate
Target: >30%

# Response time
Target: <15s (P95)

# TOON confidence
Target: >0.7
```

### Production:
```bash
# Free → Paid conversion
Target: >2.5%

# Monthly churn
Target: <7%

# Infrastructure costs
Target: <$30/month
```

---

## 🛠️ Полезные команды

### Development:
```bash
# Запустить dev сервер
npm run dev

# Проверить types
npm run type-check

# Lint code
npm run lint

# Build для production
npm run build

# Анализ bundle size
ANALYZE=true npm run build
```

### Database:
```bash
# Generate Supabase types
npx supabase gen types typescript --project-id your-project > lib/supabase/types.ts

# Run migrations
npx supabase db push
```

### Testing:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

---

## 🔗 Важные ссылки

### Сервисы:
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Anthropic Console](https://console.anthropic.com/)
- [Upstash Console](https://console.upstash.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)

### Документация:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Claude API Docs](https://docs.anthropic.com/)
- [Stripe API Docs](https://stripe.com/docs/api)

### Мониторинг:
- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry Dashboard](https://sentry.io/)

---

## 🎯 Первые задачи (TODO)

### Сегодня:
- [ ] Создать Next.js проект
- [ ] Настроить Supabase
- [ ] Создать TOON dictionary
- [ ] Реализовать базовый encoder

### Эта неделя:
- [ ] API endpoint `/api/generate`
- [ ] Preview component
- [ ] Тестовая генерация работает
- [ ] Deploy на Vercel

### Этот месяц:
- [ ] Полный MVP с auth
- [ ] Stripe integration
- [ ] 3-5 шаблонов
- [ ] Landing page

---

## 💬 Нужна помощь?

### Debugging:
1. Проверить console.log в браузере
2. Проверить Vercel logs
3. Проверить Supabase logs
4. Проверить Sentry errors

### Common Issues:

**"Unauthorized" при API запросе**:
- Проверить middleware.ts
- Проверить Supabase auth state
- Проверить cookies

**"Insufficient credits"**:
- Проверить profiles.credits в БД
- Проверить deduct_credit function
- Проверить credit_transactions

**"Generation failed"**:
- Проверить ANTHROPIC_API_KEY
- Проверить TOON encoding
- Проверить Claude API rate limits

**Preview не загружается**:
- Проверить iframe sandbox
- Проверить CSP headers
- Проверить generated code syntax

---

## 🚢 Ready to Ship Checklist

Перед первым деплоем:

### Code:
- [ ] Environment variables настроены
- [ ] Database migrations применены
- [ ] RLS policies активны
- [ ] Rate limiting работает

### Testing:
- [ ] Регистрация работает
- [ ] Генерация работает
- [ ] Preview отображается
- [ ] Credits deduction работает

### Deploy:
- [ ] Vercel project создан
- [ ] Domain настроен
- [ ] SSL активен
- [ ] Analytics подключен

### Go Live:
- [ ] Stripe webhooks настроены
- [ ] Error monitoring активен
- [ ] Backup strategy есть
- [ ] Support email настроен

---

**Good luck! 🚀**

Вопросы? См. `implementation_plan.md` для детального плана.
