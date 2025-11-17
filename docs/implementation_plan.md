# 🚀 Детальный План Реализации AI Site Generator

**Проект**: AI Site Generator
**Stack**: Next.js 14 + TypeScript + Vercel + Supabase + Claude API
**Срок MVP**: 8 недель
**Дата создания плана**: 2025-11-17

---

## 📋 Executive Summary

План реализации разбит на 7 фаз, каждая из которых фокусируется на конкретном аспекте платформы. Общий срок реализации MVP - **8 недель** с возможностью запуска FREE tier.

### Ключевые вехи:
- ✅ Week 1: Работающая инфраструктура
- ✅ Week 3: Базовая AI генерация
- ✅ Week 5: Полнофункциональный редактор
- ✅ Week 7: Интеграция платежей
- ✅ Week 8: Production ready

---

## 🏗️ PHASE 1: Инфраструктура и базовая настройка (Week 1)

### 1.1 Инициализация проекта

**Задачи:**
- [ ] Создать Next.js 14 проект с TypeScript
- [ ] Настроить ESLint + Prettier + Husky
- [ ] Настроить структуру папок согласно документации
- [ ] Установить зависимости

**Команды:**
```bash
npx create-next-app@latest ai-site-generator --typescript --tailwind --app --use-npm
cd ai-site-generator

# Core dependencies
npm install @anthropic-ai/sdk @supabase/supabase-js @upstash/redis stripe
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react next-themes

# Dev dependencies
npm install -D @types/node @types/react typescript
```

**Время**: 4 часа

---

### 1.2 Настройка Supabase

**Задачи:**
- [ ] Создать проект в Supabase
- [ ] Настроить базу данных (схема ниже)
- [ ] Настроить Authentication
- [ ] Настроить Storage buckets
- [ ] Настроить Row Level Security (RLS)

**Database Schema:**

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 3,
  tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites table
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT, -- React component code
  toon_spec TEXT, -- TOON specification
  thumbnail_url TEXT,
  status TEXT DEFAULT 'draft', -- draft | published
  custom_domain TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generations table (для аналитики)
CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  toon_spec TEXT NOT NULL,
  method TEXT, -- 'template' | 'hybrid' | 'ai'
  cost DECIMAL(10, 4),
  duration INTEGER, -- milliseconds
  cached BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credits transactions
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- negative for deduction, positive for addition
  type TEXT NOT NULL, -- 'generation' | 'purchase' | 'refund' | 'subscription'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions (Stripe)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier TEXT NOT NULL, -- 'starter' | 'pro' | 'business'
  status TEXT, -- 'active' | 'canceled' | 'past_due'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sites" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

**Storage Buckets:**
- `site-thumbnails` - превью сайтов
- `user-uploads` - референсы и изображения от пользователей

**Время**: 6 часов

---

### 1.3 Настройка Environment Variables

**Файл `.env.local`:**
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

# Upstash QStash
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pk
STRIPE_SECRET_KEY=your_stripe_sk
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Время**: 2 часа

---

### 1.4 Базовая структура проекта

**Создать следующие директории и файлы:**

```
app/
├── (marketing)/
│   ├── page.tsx                    # Landing page
│   └── layout.tsx
├── dashboard/
│   ├── page.tsx                    # User dashboard
│   └── layout.tsx
├── editor/
│   └── [id]/
│       └── page.tsx                # Editor interface
├── api/
│   ├── generate/
│   │   └── route.ts                # AI generation endpoint
│   ├── sites/
│   │   ├── route.ts                # CRUD sites
│   │   └── [id]/
│   │       └── route.ts
│   ├── credits/
│   │   └── route.ts
│   └── webhooks/
│       └── stripe/
│           └── route.ts
├── layout.tsx
└── globals.css

components/
├── ui/                              # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── GenerationPanel/
│   ├── PromptInput.tsx
│   ├── StyleSelector.tsx
│   └── ReferenceUploader.tsx
├── Editor/
│   ├── VisualEditor.tsx
│   ├── CodeEditor.tsx
│   └── Preview.tsx
└── Chat/
    └── ChatInterface.tsx

lib/
├── supabase/
│   ├── client.ts                   # Browser client
│   ├── server.ts                   # Server client
│   └── types.ts                    # Generated types
├── ai/
│   ├── claude.ts                   # Claude API wrapper
│   ├── prompts.ts                  # System prompts
│   └── toon/
│       ├── encoder.ts
│       ├── decoder.ts
│       └── dictionary.ts
├── cache/
│   ├── redis.ts                    # Upstash Redis
│   └── manager.ts                  # Cache manager
├── stripe/
│   └── client.ts
└── utils.ts

types/
└── index.ts                        # Shared types
```

**Время**: 2 часа

---

### 1.5 Настройка shadcn/ui

**Команды:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea select tabs dialog dropdown-menu
```

**Время**: 1 час

**ИТОГО PHASE 1**: 15 часов (2 дня)

---

## 🤖 PHASE 2: Core AI генерация с TOON (Week 2-3)

### 2.1 Реализация TOON Dictionary

**Файл: `lib/ai/toon/dictionary.ts`**

```typescript
export const TOON_DICTIONARY = {
  siteTypes: {
    lp: 'landing_page',
    pf: 'portfolio',
    ec: 'ecommerce',
    bl: 'blog',
  },

  styles: {
    min: 'minimalist',
    cor: 'corporate',
    cre: 'creative',
    mod: 'modern',
  },

  components: {
    h: 'hero',
    f: 'features',
    g: 'gallery',
    ct: 'contact',
    ft: 'footer',
    nav: 'navigation',
    pr: 'pricing',
    tm: 'testimonials',
  },

  layouts: {
    hero: {
      spl: 'split',
      ctr: 'centered',
      fl: 'fullwidth',
    },
    features: {
      gr2: 'grid_2col',
      gr3: 'grid_3col',
      ls: 'list',
    },
  },

  colors: {
    w: '#FFFFFF',
    b: '#000000',
    bl: '#3B82F6',
    rd: '#EF4444',
    gr: '#10B981',
    yl: '#F59E0B',
  },
} as const;

export type TOONSpec = {
  siteType: keyof typeof TOON_DICTIONARY.siteTypes;
  style?: keyof typeof TOON_DICTIONARY.styles;
  sections: Section[];
  colors?: string[];
};

export type Section = {
  type: keyof typeof TOON_DICTIONARY.components;
  layout?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  props?: Record<string, any>;
};
```

**Время**: 2 часа

---

### 2.2 TOON Encoder

**Файл: `lib/ai/toon/encoder.ts`**

Реализовать согласно спецификации в `optimization_algorithms.md`:
- Tokenization
- Intent classification
- Section extraction
- TOON string building
- Confidence calculation

**Тесты:**
```typescript
// __tests__/toon-encoder.test.ts
import { TOONEncoder } from '@/lib/ai/toon/encoder';

describe('TOONEncoder', () => {
  it('should encode simple landing page', () => {
    const encoder = new TOONEncoder();
    const result = encoder.encode('Create a minimalist landing page with hero and 3 features');

    expect(result.toon).toBe('lp{st:min|s:[h{ly:spl}|f{ly:gr3}]}');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  // More tests...
});
```

**Время**: 8 часов

---

### 2.3 TOON Decoder

**Файл: `lib/ai/toon/decoder.ts`**

Реализовать согласно спецификации в `optimization_algorithms.md`:
- Parse TOON string
- Extract site type, style, sections
- Validate format

**Время**: 4 часа

---

### 2.4 Claude API Integration

**Файл: `lib/ai/claude.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from './prompts';
import { TOON_DICTIONARY } from './toon/dictionary';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export class ClaudeService {
  async generateSite(toonSpec: string): Promise<{
    code: string;
    usage: any;
  }> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
            {
              type: 'text',
              text: JSON.stringify(TOON_DICTIONARY),
              cache_control: { type: 'ephemeral' },
            },
            {
              type: 'text',
              text: `Generate React component from TOON: ${toonSpec}`,
            },
          ],
        },
      ],
    });

    const code = this.extractCode(response.content[0].text);

    return {
      code,
      usage: response.usage,
    };
  }

  async iterateDesign(
    currentCode: string,
    instruction: string
  ): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
            {
              type: 'text',
              text: `Current code:\n\`\`\`tsx\n${currentCode}\n\`\`\`\n\nModify according to: ${instruction}`,
            },
          ],
        },
      ],
    });

    return this.extractCode(response.content[0].text);
  }

  private extractCode(text: string): string {
    const match = text.match(/```(?:tsx|jsx|javascript|typescript)\n([\s\S]*?)\n```/);
    return match ? match[1] : text;
  }
}
```

**Время**: 6 часов

---

### 2.5 System Prompts

**Файл: `lib/ai/prompts.ts`**

```typescript
export const systemPrompt = `You are an expert React/Next.js developer specializing in creating beautiful, modern landing pages and websites.

Your task is to generate production-ready React components based on TOON specifications.

TOON Format:
- Compact representation of website structure
- Example: "lp{st:min|s:[h{ly:spl}|f{ly:gr3}]}"
- Dictionary provided separately

Guidelines:
1. Use TypeScript
2. Use Tailwind CSS for styling
3. Components should be self-contained
4. Use modern React patterns (hooks, functional components)
5. Make it responsive (mobile-first)
6. Use semantic HTML
7. Include accessibility attributes
8. Add smooth animations (framer-motion if needed)
9. Use placeholder content that makes sense

Output Format:
\`\`\`tsx
// Your generated code here
export default function GeneratedSite() {
  return (
    // JSX
  );
}
\`\`\`

Do not include:
- External imports (except React, Next.js built-ins)
- API calls
- State management beyond component-local
- Comments (code should be self-explanatory)

Focus on:
- Visual appeal
- Clean, modern design
- Professional look
- Fast loading
`;
```

**Время**: 3 часа

---

### 2.6 API Route для генерации

**Файл: `app/api/generate/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ClaudeService } from '@/lib/ai/claude';
import { TOONEncoder } from '@/lib/ai/toon/encoder';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Check authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Encode to TOON
    const encoder = new TOONEncoder();
    const { toon, confidence } = encoder.encode(prompt);

    if (confidence < 0.5) {
      return NextResponse.json(
        { error: 'Could not understand prompt. Please be more specific.' },
        { status: 400 }
      );
    }

    // Generate site
    const claude = new ClaudeService();
    const { code, usage } = await claude.generateSite(toon);

    // Calculate cost
    const cost = this.calculateCost(usage);

    // Create site record
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        title: this.extractTitle(prompt),
        slug: this.generateSlug(),
        code,
        toon_spec: toon,
        status: 'draft',
      })
      .select()
      .single();

    if (siteError) throw siteError;

    // Deduct credit
    await supabase.rpc('deduct_credit', { user_id: user.id, amount: 1 });

    // Log generation
    await supabase.from('generations').insert({
      user_id: user.id,
      site_id: site.id,
      toon_spec: toon,
      method: 'ai',
      cost,
      duration: 0, // TODO: measure
      cached: false,
    });

    return NextResponse.json({
      site,
      toon,
      confidence,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateCost(usage: any): number {
  const inputCost = (usage.input_tokens || 0) * 0.003 / 1000;
  const outputCost = (usage.output_tokens || 0) * 0.015 / 1000;
  const cacheCost = (usage.cache_creation_input_tokens || 0) * 0.003 / 1000;
  const cacheReadCost = (usage.cache_read_input_tokens || 0) * 0.0003 / 1000;

  return inputCost + outputCost + cacheCost + cacheReadCost;
}

function extractTitle(prompt: string): string {
  // Extract first sentence or first 50 chars
  const firstSentence = prompt.split(/[.!?]/)[0];
  return firstSentence.substring(0, 50);
}

function generateSlug(): string {
  return `site-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
```

**Время**: 6 часов

**ИТОГО PHASE 2**: 29 часов (4 дня)

---

## 🎨 PHASE 3: Editor и Preview система (Week 4)

### 3.1 Dashboard Page

**Файл: `app/dashboard/page.tsx`**

Функциональность:
- [ ] Список всех сайтов пользователя
- [ ] Карточки с превью
- [ ] Кнопка "Создать новый сайт"
- [ ] Статус сайтов (draft/published)
- [ ] Действия: Edit, Delete, Publish

**Компоненты:**
- `SiteCard` - карточка сайта
- `CreateSiteDialog` - модальное окно создания
- `SiteActions` - меню действий

**Время**: 8 часов

---

### 3.2 Generation Panel

**Файл: `components/GenerationPanel/PromptInput.tsx`**

Функциональность:
- [ ] Textarea для промпта
- [ ] Подсказки и примеры
- [ ] Валидация
- [ ] Кнопка "Generate"
- [ ] Loading state

**Файл: `components/GenerationPanel/StyleSelector.tsx`**

Функциональность:
- [ ] Выбор стиля (minimalist, corporate, creative, modern)
- [ ] Превью стилей
- [ ] Radio buttons или визуальный селектор

**Время**: 6 часов

---

### 3.3 Preview Component

**Файл: `components/Editor/Preview.tsx`**

Функциональность:
- [ ] Iframe для изолированного рендера
- [ ] Responsive toggle (desktop/tablet/mobile)
- [ ] Refresh button
- [ ] Error boundary

```typescript
'use client';

import { useState, useEffect } from 'react';

export function Preview({ code }: { code: string }) {
  const [scale, setScale] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeContent, setIframeContent] = useState('');

  useEffect(() => {
    // Build iframe content
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="module">
            import React from 'https://esm.sh/react@18';
            import ReactDOM from 'https://esm.sh/react-dom@18/client';

            ${code}

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(GeneratedSite));
          </script>
        </body>
      </html>
    `;

    setIframeContent(html);
  }, [code]);

  const dimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  return (
    <div className="preview-container">
      <div className="preview-toolbar">
        <button onClick={() => setScale('desktop')}>Desktop</button>
        <button onClick={() => setScale('tablet')}>Tablet</button>
        <button onClick={() => setScale('mobile')}>Mobile</button>
      </div>

      <iframe
        srcDoc={iframeContent}
        style={dimensions[scale]}
        className="preview-iframe"
        sandbox="allow-scripts"
      />
    </div>
  );
}
```

**Время**: 10 часов

---

### 3.4 Code Editor (опционально)

**Файл: `components/Editor/CodeEditor.tsx`**

Использовать Monaco Editor или CodeMirror:
```bash
npm install @monaco-editor/react
```

Функциональность:
- [ ] Syntax highlighting
- [ ] Code editing
- [ ] Format button
- [ ] Copy to clipboard

**Время**: 6 часов (опционально для MVP)

---

### 3.5 Editor Page

**Файл: `app/editor/[id]/page.tsx`**

Layout:
```
┌─────────────────────────────────────────┐
│  Header (Title, Save, Publish)          │
├─────────────┬───────────────────────────┤
│             │                           │
│  Chat       │      Preview              │
│  Panel      │                           │
│             │                           │
│  (left)     │      (right)              │
│             │                           │
└─────────────┴───────────────────────────┘
```

Функциональность:
- [ ] Загрузка сайта по ID
- [ ] Split view: Chat + Preview
- [ ] Auto-save (debounced)
- [ ] Publish button

**Время**: 8 часов

**ИТОГО PHASE 3**: 38 часов (5 дней)

---

## 🔐 PHASE 4: Аутентификация и Credits система (Week 5)

### 4.1 Supabase Auth Setup

**Файл: `lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Файл: `lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

**Время**: 3 часа

---

### 4.2 Auth Pages

**Файлы:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/forgot-password/page.tsx`

Функциональность:
- [ ] Email/Password auth
- [ ] Google OAuth (опционально)
- [ ] GitHub OAuth (опционально)
- [ ] Password reset flow

**Время**: 8 часов

---

### 4.3 Middleware для защиты роутов

**Файл: `middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          response.cookies.delete(name);
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard and editor routes
  if (!user && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/editor')
  )) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Время**: 3 часа

---

### 4.4 Credits система

**Database Function для дедукции кредитов:**

```sql
CREATE OR REPLACE FUNCTION deduct_credit(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET credits = credits - amount
  WHERE id = user_id AND credits >= amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (user_id, -amount, 'generation', 'Site generation');
END;
$$ LANGUAGE plpgsql;
```

**API Route для проверки кредитов:**

```typescript
// app/api/credits/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, tier')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    credits: profile?.credits || 0,
    tier: profile?.tier || 'free',
  });
}
```

**Компонент Credits Display:**

```typescript
// components/CreditsDisplay.tsx
'use client';

import { useEffect, useState } from 'react';

export function CreditsDisplay() {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetch('/api/credits')
      .then(res => res.json())
      .then(data => setCredits(data.credits));
  }, []);

  return (
    <div className="credits-badge">
      {credits} credits remaining
    </div>
  );
}
```

**Время**: 6 часов

**ИТОГО PHASE 4**: 20 часов (3 дня)

---

## ⚡ PHASE 5: Оптимизация и кэширование (Week 6)

### 5.1 Upstash Redis Setup

**Файл: `lib/cache/redis.ts`**

```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

**Время**: 1 час

---

### 5.2 Cache Manager

**Файл: `lib/cache/manager.ts`**

Реализовать согласно `optimization_algorithms.md`:
- `getOrGenerate()` - get from cache or execute
- `generateKey()` - deterministic cache key
- `normalizeTOON()` - normalize spec
- `getStats()` - cache statistics

**Время**: 8 часов

---

### 5.3 Интеграция кэша в генерацию

Обновить `app/api/generate/route.ts`:

```typescript
import { CacheManager } from '@/lib/cache/manager';

// В функции POST:
const cache = new CacheManager();
const { code, cached } = await cache.getOrGenerate(
  toon,
  () => claude.generateSite(toon).then(r => r.code)
);

// Log whether it was cached
await supabase.from('generations').insert({
  // ...
  cached,
});
```

**Время**: 3 часа

---

### 5.4 Template System (базовый)

**Создать папку `lib/templates/`**

Файлы:
- `library.ts` - коллекция шаблонов
- `matcher.ts` - template matching logic

**Базовый шаблон:**

```typescript
// lib/templates/library.ts
export const templates = [
  {
    id: 'minimal-landing-1',
    spec: {
      siteType: 'lp',
      style: 'min',
      sections: [
        { type: 'h', layout: 'ctr' },
        { type: 'f', layout: 'gr3' },
        { type: 'ct', layout: 'ctr' },
      ],
    },
    code: `
export default function MinimalLanding() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold">{{title}}</h1>
        <p className="text-xl mt-4 text-gray-600">{{subtitle}}</p>
        <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg">
          Get Started
        </button>
      </section>

      <section className="py-20">
        <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Features -->
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center">Contact Us</h2>
          <!-- Contact form -->
        </div>
      </section>
    </div>
  );
}
    `,
  },
  // More templates...
];
```

**Время**: 10 часов (создание 3-5 базовых шаблонов)

---

### 5.5 Hybrid Generator

**Файл: `lib/generators/hybrid.ts`**

Реализовать согласно `optimization_algorithms.md`:
- Template matching
- Decision tree (pure template / hybrid / full AI)
- Cost calculation

**Время**: 6 часов

---

### 5.6 Rate Limiting (Edge Middleware)

**Файл: `middleware.ts` (добавить)**

```typescript
import { redis } from '@/lib/cache/redis';

export async function middleware(request: NextRequest) {
  // ... existing auth check

  // Rate limiting for /api/generate
  if (request.nextUrl.pathname === '/api/generate') {
    const userId = user?.id || 'anonymous';
    const key = `ratelimit:${userId}`;
    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, 3600); // 1 hour
    }

    const limit = await getUserLimit(userId);

    if (requests > limit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  return response;
}
```

**Время**: 4 часов

**ИТОГО PHASE 5**: 32 часа (4 дня)

---

## 💳 PHASE 6: Payments и подписки (Week 7)

### 6.1 Stripe Setup

**Создать продукты в Stripe Dashboard:**
- Starter ($15/month)
- Pro ($29/month)
- Business ($79/month)
- Credits packages

**Файл: `lib/stripe/client.ts`**

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  business: process.env.STRIPE_BUSINESS_PRICE_ID!,
};
```

**Время**: 4 часа

---

### 6.2 Checkout Session API

**Файл: `app/api/checkout/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_IDS } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { tier } = await req.json();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [
      {
        price: PRICE_IDS[tier as keyof typeof PRICE_IDS],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      user_id: user.id,
      tier,
    },
  });

  return NextResponse.json({ url: session.url });
}
```

**Время**: 4 часа

---

### 6.3 Webhook Handler

**Файл: `app/api/webhooks/stripe/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata.user_id;
  const tier = session.metadata.tier;

  // Update user profile
  await supabase
    .from('profiles')
    .update({ tier })
    .eq('id', userId);

  // Create subscription record
  await supabase.from('subscriptions').insert({
    user_id: userId,
    stripe_customer_id: session.customer,
    stripe_subscription_id: session.subscription,
    tier,
    status: 'active',
  });

  // Grant credits based on tier
  const creditsMap = {
    starter: 15,
    pro: 50,
    business: 100,
  };

  await supabase.rpc('add_credits', {
    user_id: userId,
    amount: creditsMap[tier as keyof typeof creditsMap],
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: any) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (sub) {
    // Downgrade to free tier
    await supabase
      .from('profiles')
      .update({ tier: 'free' })
      .eq('id', sub.user_id);

    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id);
  }
}
```

**Время**: 8 часов

---

### 6.4 Pricing Page

**Файл: `app/pricing/page.tsx`**

Функциональность:
- [ ] Pricing cards для каждого tier
- [ ] Feature comparison
- [ ] CTA buttons
- [ ] FAQ section

**Время**: 6 часов

---

### 6.5 Subscription Management

**Файл: `app/dashboard/subscription/page.tsx`**

Функциональность:
- [ ] Current plan display
- [ ] Usage stats
- [ ] Upgrade/Downgrade buttons
- [ ] Cancel subscription
- [ ] Billing history

**Время**: 6 часов

**ИТОГО PHASE 6**: 28 часов (4 дня)

---

## 🚀 PHASE 7: Деплой и мониторинг (Week 8)

### 7.1 Vercel Deployment

**Настройка:**
1. Подключить GitHub repo
2. Настроить Environment Variables
3. Настроить domains
4. Настроить Vercel Cron Jobs

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/warm-cache",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Время**: 4 часа

---

### 7.2 Cron Jobs

**Файл: `app/api/cron/warm-cache/route.ts`**

```typescript
export async function GET() {
  // Warm cache for popular patterns
  const patterns = await getPopularPatterns({ limit: 10 });

  for (const pattern of patterns) {
    await claude.generateSite(pattern.toonSpec);
  }

  return NextResponse.json({ success: true });
}
```

**Файл: `app/api/cron/cleanup/route.ts`**

```typescript
export async function GET() {
  // Delete draft sites older than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await supabase
    .from('sites')
    .delete()
    .eq('status', 'draft')
    .lt('created_at', thirtyDaysAgo.toISOString());

  return NextResponse.json({ success: true });
}
```

**Время**: 4 часа

---

### 7.3 Monitoring Setup

**Sentry для error tracking:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Файл: `sentry.client.config.ts`**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

**Время**: 3 часа

---

### 7.4 Analytics

**Vercel Analytics:**

```bash
npm install @vercel/analytics
```

**Файл: `app/layout.tsx`**

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Metrics Dashboard:**

Создать страницу `/dashboard/analytics` для отображения:
- Total generations
- Cache hit rate
- Average cost per generation
- User growth
- Revenue metrics

**Время**: 6 часов

---

### 7.5 Performance Optimizations

**Next.js Optimizations:**
- [ ] Enable Image Optimization
- [ ] Setup ISR for landing page
- [ ] Code splitting
- [ ] Bundle analysis

```bash
npm install @next/bundle-analyzer
```

**next.config.js:**

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    domains: ['your-supabase-url.supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
});
```

**Время**: 4 часов

---

### 7.6 Testing & QA

**E2E тесты с Playwright:**

```bash
npm install -D @playwright/test
npx playwright install
```

**tests/e2e/generation.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test('should generate site from prompt', async ({ page }) => {
  await page.goto('/dashboard');

  await page.click('text=Create New Site');
  await page.fill('textarea[name="prompt"]', 'Create a minimalist landing page');
  await page.click('button:has-text("Generate")');

  await expect(page.locator('.preview')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.code-output')).toContainText('export default');
});
```

**Checklist:**
- [ ] Регистрация нового пользователя
- [ ] Генерация сайта
- [ ] Редактирование сайта
- [ ] Публикация сайта
- [ ] Покупка кредитов
- [ ] Подписка на тариф
- [ ] Mobile responsiveness

**Время**: 8 часов

---

### 7.7 Documentation

**Создать:**
- [ ] README.md - setup инструкции
- [ ] CONTRIBUTING.md - для контрибьюторов
- [ ] docs/API.md - API документация
- [ ] docs/DEPLOYMENT.md - деплой инструкции

**Время**: 4 часа

**ИТОГО PHASE 7**: 33 часа (4-5 дней)

---

## 📊 Итоговый Timeline

```
Week 1: Infrastructure Setup              15 hours
Week 2-3: Core AI Generation              29 hours
Week 4: Editor & Preview                  38 hours
Week 5: Auth & Credits                    20 hours
Week 6: Optimization & Caching            32 hours
Week 7: Payments & Subscriptions          28 hours
Week 8: Deploy & Monitoring               33 hours
────────────────────────────────────────────────────
TOTAL:                                   195 hours ≈ 8 weeks
```

---

## 🎯 Success Criteria для MVP

### Функциональные требования:
- ✅ Пользователь может зарегистрироваться
- ✅ Пользователь получает 3 бесплатных генерации
- ✅ Генерация сайта из текстового промпта работает
- ✅ Сгенерированный код отображается в preview
- ✅ Пользователь может итеративно менять дизайн через чат
- ✅ Возможность экспорта кода
- ✅ Возможность купить кредиты
- ✅ Подписки работают корректно

### Технические требования:
- ✅ TOON encoding работает (>0.7 confidence)
- ✅ Промпт кэширование активно
- ✅ Response кэширование >30% hit rate
- ✅ Средняя стоимость генерации <$0.10
- ✅ P95 latency <15 seconds
- ✅ Uptime >99%

### Бизнес требования:
- ✅ Infrastructure costs <$30/month
- ✅ Работающая воронка free → paid
- ✅ Stripe integration для payments
- ✅ Базовая аналитика работает

---

## 🚧 Post-MVP Roadmap

### Month 4-6 (Optimization):
1. **Template Library расширение**
   - 10+ профессиональных шаблонов
   - Template marketplace (user-submitted)

2. **Advanced Caching**
   - Predictive cache warming
   - User pattern analysis

3. **Email Automation**
   - Welcome series
   - Onboarding emails
   - Usage tips

4. **Referral Program**
   - Give 3, Get 3 credits
   - Tracking dashboard

### Month 7-12 (Scale):
1. **Background Jobs**
   - QStash для длинных генераций
   - Batch processing

2. **AI Image Generation**
   - DALL-E integration
   - Custom illustrations

3. **Multi-page Sites**
   - Navigation between pages
   - Shared components

4. **Analytics Dashboard**
   - Site traffic stats
   - Conversion tracking

5. **Integrations**
   - Export to Vercel
   - Export to Netlify
   - GitHub sync
   - Zapier webhooks

---

## 🔧 Development Best Practices

### Git Workflow:
```bash
main              # Production
├── develop       # Development
└── feature/*     # Feature branches
```

### Commit Convention:
```
feat: Add TOON encoder
fix: Fix cache key generation
docs: Update API documentation
style: Format code
refactor: Simplify template matcher
test: Add e2e tests for generation
chore: Update dependencies
```

### Code Review Checklist:
- [ ] TypeScript types are correct
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Mobile responsive
- [ ] Accessibility attributes
- [ ] Tests written (if applicable)
- [ ] Performance optimized

---

## 📝 Notes & Considerations

### Security:
- ✅ All API routes protected by auth
- ✅ RLS enabled on all tables
- ✅ Rate limiting on expensive endpoints
- ✅ Input validation on all user inputs
- ✅ CSRF protection (Next.js default)
- ✅ XSS prevention (React escaping)

### Performance:
- ✅ Edge functions for rate limiting
- ✅ Streaming responses for better UX
- ✅ Image optimization
- ✅ Code splitting
- ✅ ISR for landing pages

### Cost Management:
- ✅ TOON reduces AI costs by 67%
- ✅ Caching reduces duplicate generations
- ✅ Template system for common patterns
- ✅ Serverless = pay-per-use
- ✅ Free tiers maximize runway

### Scalability:
- ✅ Serverless architecture auto-scales
- ✅ Database connection pooling (Supabase)
- ✅ Redis for distributed caching
- ✅ CDN for global distribution

---

## ✅ Pre-Launch Checklist

### Technical:
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] RLS policies tested
- [ ] Stripe webhooks configured
- [ ] Domain DNS configured
- [ ] SSL certificates active
- [ ] Error monitoring active (Sentry)
- [ ] Analytics tracking (Vercel)
- [ ] Backup strategy configured
- [ ] Load testing completed

### Legal & Compliance:
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Cookie consent (if EU traffic)
- [ ] GDPR compliance
- [ ] Refund policy documented
- [ ] Stripe account verified

### Marketing:
- [ ] Landing page live
- [ ] SEO metadata configured
- [ ] Open Graph images
- [ ] Twitter card metadata
- [ ] Product Hunt submission prepared
- [ ] Social media accounts created
- [ ] Demo video recorded
- [ ] Press kit prepared

### Operations:
- [ ] Support email configured
- [ ] Status page setup (optional)
- [ ] Incident response plan
- [ ] Backup admin accounts
- [ ] Monitoring alerts configured
- [ ] On-call rotation (if team)

---

## 🎓 Learning Resources

### Next.js:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

### Supabase:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

### Claude API:
- [Anthropic Documentation](https://docs.anthropic.com)
- [Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)

### Stripe:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)

---

**Version**: 1.0
**Last Updated**: 2025-11-17
**Estimated Completion**: 8 weeks
**Difficulty**: Intermediate to Advanced
