# 🎨 AI Site Generator (SiterSyn)

> Мгновенная генерация профессиональных сайтов с помощью AI по одному текстовому запросу

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 О проекте

AI Site Generator - это платформа, которая за **5 минут** превращает текстовое описание в полностью рабочий, профессионально выглядящий сайт.

### ✨ Ключевые особенности

- ⚡ **Мгновенная генерация** - от промпта до сайта за 5 минут
- 🤖 **AI-powered** - использует Claude Sonnet 4 для генерации React кода
- 🎨 **Профессиональный дизайн** - адаптивные, современные компоненты
- 💬 **Итеративное редактирование** - улучшайте дизайн через чат
- 💰 **Доступная цена** - $15-30 вместо $500+
- 📤 **Полное владение** - экспорт кода без ограничений

---

## 🚀 Быстрый старт

### Локальная разработка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/yourusername/SiterSyn.git
cd SiterSyn

# 2. Установить зависимости
npm install

# 3. Настроить environment variables
cp .env.example .env
# Отредактируйте .env, добавив ваши API ключи

# 4. Запустить dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Environment Variables

Создайте `.env` файл со следующими переменными:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Stripe
STRIPE_SECRET_KEY=your_stripe_sk
STRIPE_WEBHOOK_SECRET=your_webhook_secret
# ... и другие (см. .env.example)
```

### Документация

Полная документация в папке `/docs`:

1. **[Project Overview](docs/project_overview.md)** - обзор проекта и технологий
2. **[Implementation Plan](docs/implementation_plan.md)** - детальный план реализации
3. **[API Documentation](docs/API.md)** - API reference
4. **[Deployment Guide](docs/DEPLOYMENT.md)** - руководство по деплою
5. **[Optimization Algorithms](docs/optimization_algorithms.md)** - технические детали
6. **[Financial Model](docs/financial_model.md)** - бизнес-модель и прогнозы

---

## 🏗️ Архитектура

**Stack:**
- **Frontend/Backend**: Next.js 14 + TypeScript
- **Hosting**: Vercel (Serverless)
- **Database**: Supabase (PostgreSQL + Auth)
- **Cache**: Upstash Redis
- **AI**: Claude API (Anthropic)
- **Payments**: Stripe

**Уникальная технология: TOON Encoding**
- Снижает AI costs на **67%**
- Ускоряет обработку на **40%**
- Повышает точность генерации

---

## 📂 Структура проекта

```
SiterSyn/
├── docs/                          # 📚 Вся документация
│   ├── project_overview.md        # Обзор проекта
│   ├── implementation_plan.md     # План реализации (8 недель)
│   ├── QUICKSTART.md              # Быстрый старт
│   ├── optimization_algorithms.md # Технические детали
│   └── financial_model.md         # Финансовая модель
│
└── (будущая структура кода)
    ├── app/                       # Next.js app directory
    ├── components/                # React компоненты
    ├── lib/                       # Утилиты и интеграции
    └── tests/                     # Тесты
```

---

## 📊 План реализации

### Timeline: 8 недель

1. **Week 1**: Инфраструктура и базовая настройка (15 часов)
2. **Week 2-3**: Core AI генерация с TOON (29 часов)
3. **Week 4**: Editor и Preview система (38 часов)
4. **Week 5**: Аутентификация и Credits (20 часов)
5. **Week 6**: Оптимизация и кэширование (32 часа)
6. **Week 7**: Payments и подписки (28 часов)
7. **Week 8**: Деплой и мониторинг (33 часа)

**ИТОГО**: 195 часов ≈ 8 недель

См. [Implementation Plan](docs/implementation_plan.md) для деталей.

---

## 💰 Финансовая модель

### Тарифы:
- **FREE**: 3 генерации, 1 сайт
- **STARTER**: $15/мес - 15 генераций, 3 сайта
- **PRO**: $29/мес - 50 генераций, 10 сайтов
- **BUSINESS**: $79/мес - безлимит, white label

### Прогноз Year 1 (реалистичный):
- **Пользователи**: 4,500
- **MRR**: $3,075
- **Profit**: $5,543
- **ROI**: 555%
- **Breakeven**: Month 3

См. [Financial Model](docs/financial_model.md) для деталей.

---

## 🎯 Текущий статус

- 🟢 **Документация**: Complete
- 🟢 **Разработка**: MVP Complete
  - ✅ Phase 1: Infrastructure
  - ✅ Phase 2: AI Generation with TOON
  - ✅ Phase 3: Editor & Preview
  - ✅ Phase 4: Authentication & Credits
  - ✅ Phase 5: Optimization & Caching
  - ✅ Phase 6: Payments (Stripe + YooKassa)
  - ✅ Phase 7: Deployment & Monitoring
- 🟡 **Testing**: In Progress
- ⚪ **Production**: Ready for Deploy

---

## 📞 Контакты

- **Email**: support@sitersyn.com
- **GitHub**: [github.com/yourusername/SiterSyn](https://github.com/yourusername/SiterSyn)

---

**Made with ❤️ and AI**
