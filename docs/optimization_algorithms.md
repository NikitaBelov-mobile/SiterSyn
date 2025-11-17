# Алгоритмы оптимизации промптов и кэширования (Next.js Stack)

## Содержание
1. TOON Encoding/Decoding (TypeScript)
2. Prompt Caching стратегии
3. Intelligent Template Selection
4. Response Caching (Upstash Redis)
5. Serverless Optimizations (Vercel-specific)
6. Rate Limiting (Edge Functions)
7. Cost Optimization Algorithms
8. Performance Monitoring

---

## 1. TOON Encoding/Decoding (TypeScript)

### 1.1 TOON Dictionary (TypeScript Types)

```typescript
// lib/toon/dictionary.ts

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
  },
} as const;

export type TOONSpec = {
  siteType: keyof typeof TOON_DICTIONARY.siteTypes;
  style?: keyof typeof TOON_DICTIONARY.styles;
  sections: Section[];
  colors?: string[];
};

type Section = {
  type: keyof typeof TOON_DICTIONARY.components;
  layout?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  props?: Record<string, any>;
};
```

### 1.2 Encoder Implementation (TypeScript)

```typescript
// lib/toon/encoder.ts

import { TOON_DICTIONARY, type TOONSpec } from './dictionary';

export class TOONEncoder {
  /**
   * Encodes natural language to TOON specification
   */
  encode(prompt: string): {
    toon: string;
    spec: TOONSpec;
    confidence: number;
  } {
    // Step 1: Tokenize and analyze
    const tokens = this.tokenize(prompt);
    const intent = this.classifyIntent(tokens);
    
    // Step 2: Extract components
    const sections = this.extractSections(tokens);
    
    // Step 3: Build TOON string
    const toon = this.buildTOONString(intent, sections);
    
    // Step 4: Calculate confidence
    const confidence = this.calculateConfidence(intent, sections);
    
    return {
      toon,
      spec: { ...intent, sections },
      confidence,
    };
  }
  
  private tokenize(prompt: string): string[] {
    return prompt
      .toLowerCase()
      .split(/\s+/)
      .filter(token => token.length > 2);
  }
  
  private classifyIntent(tokens: string[]): Pick<TOONSpec, 'siteType' | 'style'> {
    // Keyword matching for site type
    const siteType = this.detectSiteType(tokens);
    const style = this.detectStyle(tokens);
    
    return { siteType, style };
  }
  
  private detectSiteType(tokens: string[]): TOONSpec['siteType'] {
    const keywords = {
      lp: ['landing', 'page', 'promo', 'lead'],
      pf: ['portfolio', 'work', 'showcase'],
      ec: ['shop', 'store', 'ecommerce', 'product'],
      bl: ['blog', 'article', 'post'],
    };
    
    for (const [type, words] of Object.entries(keywords)) {
      if (tokens.some(token => words.includes(token))) {
        return type as TOONSpec['siteType'];
      }
    }
    
    return 'lp'; // default
  }
  
  private detectStyle(tokens: string[]): TOONSpec['style'] {
    const keywords = {
      min: ['minimal', 'clean', 'simple', 'minimalist'],
      cor: ['corporate', 'professional', 'business'],
      cre: ['creative', 'artistic', 'unique'],
      mod: ['modern', 'contemporary', 'sleek'],
    };
    
    for (const [style, words] of Object.entries(keywords)) {
      if (tokens.some(token => words.includes(token))) {
        return style as TOONSpec['style'];
      }
    }
    
    return 'min'; // default
  }
  
  private extractSections(tokens: string[]): Section[] {
    const sections: Section[] = [];
    
    // Detect hero
    if (this.containsAny(tokens, ['hero', 'header', 'main', 'top'])) {
      sections.push({
        type: 'h',
        layout: 'spl', // default split layout
      });
    }
    
    // Detect features
    if (this.containsAny(tokens, ['features', 'benefits', 'services'])) {
      const count = this.extractNumber(tokens) || 3;
      sections.push({
        type: 'f',
        layout: count === 2 ? 'gr2' : 'gr3',
        props: { count },
      });
    }
    
    // Detect gallery
    if (this.containsAny(tokens, ['gallery', 'images', 'photos', 'portfolio'])) {
      sections.push({
        type: 'g',
        layout: 'grd',
      });
    }
    
    // Detect contact
    if (this.containsAny(tokens, ['contact', 'form', 'reach'])) {
      sections.push({
        type: 'ct',
        layout: 'ctr',
        props: { hasForm: true },
      });
    }
    
    return sections;
  }
  
  private buildTOONString(
    intent: Pick<TOONSpec, 'siteType' | 'style'>,
    sections: Section[]
  ): string {
    let toon = intent.siteType;
    
    if (intent.style) {
      toon += `{st:${intent.style}`;
    } else {
      toon += '{';
    }
    
    if (sections.length > 0) {
      const sectionStr = sections
        .map(s => {
          let str = s.type;
          if (s.layout) str += `{ly:${s.layout}}`;
          return str;
        })
        .join('|');
      
      toon += `|s:[${sectionStr}]`;
    }
    
    toon += '}';
    
    return toon;
  }
  
  private calculateConfidence(
    intent: Pick<TOONSpec, 'siteType' | 'style'>,
    sections: Section[]
  ): number {
    let confidence = 0.5; // base
    
    if (intent.style) confidence += 0.2;
    if (sections.length > 0) confidence += 0.1 * Math.min(sections.length, 3);
    
    return Math.min(confidence, 1.0);
  }
  
  private containsAny(tokens: string[], keywords: string[]): boolean {
    return tokens.some(token => keywords.includes(token));
  }
  
  private extractNumber(tokens: string[]): number | null {
    for (const token of tokens) {
      const num = parseInt(token, 10);
      if (!isNaN(num)) return num;
    }
    return null;
  }
}

// Usage:
// const encoder = new TOONEncoder();
// const result = encoder.encode("Create a minimalist landing page with hero and 3 features");
// console.log(result.toon); // "lp{st:min|s:[h{ly:spl}|f{ly:gr3}]}"
```

### 1.3 Decoder Implementation

```typescript
// lib/toon/decoder.ts

import { TOON_DICTIONARY, type TOONSpec } from './dictionary';

export class TOONDecoder {
  /**
   * Decodes TOON string to structured spec
   */
  decode(toon: string): TOONSpec {
    const match = toon.match(/^(\w+)\{(.+)\}$/);
    
    if (!match) {
      throw new Error('Invalid TOON format');
    }
    
    const [, siteType, content] = match;
    const parts = this.parseContent(content);
    
    return {
      siteType: siteType as TOONSpec['siteType'],
      style: parts.st as TOONSpec['style'],
      sections: parts.s || [],
      colors: parts.col,
    };
  }
  
  private parseContent(content: string): Record<string, any> {
    const parts: Record<string, any> = {};
    
    // Split by | but respect nested structures
    const tokens = this.tokenize(content);
    
    for (const token of tokens) {
      const [key, value] = token.split(':');
      
      if (key === 's') {
        // Parse sections array
        parts.s = this.parseSections(value);
      } else if (value) {
        parts[key] = value;
      }
    }
    
    return parts;
  }
  
  private tokenize(content: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let depth = 0;
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      if (char === '[' || char === '{') {
        depth++;
        current += char;
      } else if (char === ']' || char === '}') {
        depth--;
        current += char;
      } else if (char === '|' && depth === 0) {
        if (current) tokens.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current) tokens.push(current);
    
    return tokens;
  }
  
  private parseSections(sectionsStr: string): Section[] {
    // Remove surrounding brackets
    const cleaned = sectionsStr.replace(/^\[|\]$/g, '');
    
    // Split sections
    const sections: Section[] = [];
    const sectionTokens = cleaned.split('|');
    
    for (const token of sectionTokens) {
      const match = token.match(/^(\w+)(?:\{(.+)\})?$/);
      
      if (match) {
        const [, type, propsStr] = match;
        const section: Section = { type: type as any };
        
        if (propsStr) {
          const props = propsStr.split('|');
          for (const prop of props) {
            const [k, v] = prop.split(':');
            if (k === 'ly') section.layout = v;
            else if (k === 'sz') section.size = v as any;
            // Add more properties as needed
          }
        }
        
        sections.push(section);
      }
    }
    
    return sections;
  }
}

// Usage:
// const decoder = new TOONDecoder();
// const spec = decoder.decode("lp{st:min|s:[h{ly:spl}|f{ly:gr3}]}");
```

---

## 2. Prompt Caching (Next.js Implementation)

### 2.1 Claude API with Caching (TypeScript)

```typescript
// lib/ai/claude.ts

import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export class ClaudeService {
  /**
   * Generate site code with prompt caching
   */
  async generateSite(toonSpec: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            // CACHED PART (system prompt + dictionary)
            {
              type: 'text',
              text: systemPrompt, // ~2000 tokens
              cache_control: { type: 'ephemeral' }, // 90% discount for 5 min
            },
            {
              type: 'text',
              text: JSON.stringify(TOON_DICTIONARY),
              cache_control: { type: 'ephemeral' },
            },
            // DYNAMIC PART (user's TOON spec)
            {
              type: 'text',
              text: `Generate React component from TOON: ${toonSpec}`,
            },
          ],
        },
      ],
    });
    
    const code = this.extractCode(response.content[0].text);
    
    // Log cache metrics
    if (response.usage) {
      console.log('Cache performance:', {
        inputTokens: response.usage.input_tokens,
        cacheCreationTokens: response.usage.cache_creation_input_tokens,
        cacheReadTokens: response.usage.cache_read_input_tokens,
      });
    }
    
    return code;
  }
  
  /**
   * Iterate on existing design
   */
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
            // System prompt is still cached
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
    const match = text.match(/```tsx\n([\s\S]*?)\n```/);
    return match ? match[1] : text;
  }
}
```

### 2.2 Cache Warming (Vercel Cron)

```typescript
// app/api/cron/warm-cache/route.ts

import { ClaudeService } from '@/lib/ai/claude';
import { getPopularPatterns } from '@/lib/analytics';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Run on edge for global distribution

// Vercel Cron: runs every 4 minutes
export async function GET() {
  const claudeService = new ClaudeService();
  
  // Get top patterns from analytics
  const patterns = await getPopularPatterns({ limit: 10 });
  
  for (const pattern of patterns) {
    // Make dummy request to warm cache
    await claudeService.generateSite(pattern.toonSpec);
  }
  
  return NextResponse.json({ success: true, warmed: patterns.length });
}

// Configure in vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/warm-cache",
//     "schedule": "*/4 * * * *"
//   }]
// }
```

---

## 3. Multi-layer Caching (Upstash Redis)

### 3.1 Cache Manager Implementation

```typescript
// lib/cache/manager.ts

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class CacheManager {
  /**
   * Get cached generation or execute and cache
   */
  async getOrGenerate(
    toonSpec: string,
    generator: () => Promise<string>
  ): Promise<{ code: string; cached: boolean }> {
    // Generate cache key
    const cacheKey = this.generateKey(toonSpec);
    
    // Try to get from cache
    const cached = await redis.get<string>(cacheKey);
    
    if (cached) {
      // Cache hit
      await this.incrementHits(cacheKey);
      return { code: cached, cached: true };
    }
    
    // Cache miss - generate
    const code = await generator();
    
    // Store in cache (24 hour TTL)
    await redis.setex(cacheKey, 86400, code);
    
    return { code, cached: false };
  }
  
  /**
   * Generate deterministic cache key from TOON spec
   */
  private generateKey(toonSpec: string): string {
    // Normalize TOON spec
    const normalized = this.normalizeTOON(toonSpec);
    
    // Hash for shorter key
    const hash = this.simpleHash(normalized);
    
    return `gen:v2:${hash}`;
  }
  
  private normalizeTOON(toon: string): string {
    // Remove whitespace, lowercase, sort components
    return toon
      .toLowerCase()
      .replace(/\s+/g, '')
      .split('|')
      .sort()
      .join('|');
  }
  
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  private async incrementHits(key: string): Promise<void> {
    await redis.incr(`${key}:hits`);
  }
  
  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    hitRate: number;
  }> {
    const keys = await redis.keys('gen:v2:*');
    const totalKeys = keys.length;
    
    // Calculate hit rate from hits counter
    let totalHits = 0;
    for (const key of keys.slice(0, 100)) { // Sample 100 keys
      const hits = await redis.get<number>(`${key}:hits`) || 0;
      totalHits += hits;
    }
    
    const hitRate = totalHits / (totalKeys || 1);
    
    return { totalKeys, hitRate };
  }
}
```

### 3.2 Usage in API Route

```typescript
// app/api/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ClaudeService } from '@/lib/ai/claude';
import { CacheManager } from '@/lib/cache/manager';
import { TOONEncoder } from '@/lib/toon/encoder';

export const runtime = 'edge'; // Run on Vercel Edge

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  
  // Encode to TOON
  const encoder = new TOONEncoder();
  const { toon, confidence } = encoder.encode(prompt);
  
  if (confidence < 0.5) {
    return NextResponse.json(
      { error: 'Could not understand prompt' },
      { status: 400 }
    );
  }
  
  // Try cache, fallback to generation
  const cache = new CacheManager();
  const claude = new ClaudeService();
  
  const { code, cached } = await cache.getOrGenerate(
    toon,
    () => claude.generateSite(toon)
  );
  
  return NextResponse.json({
    code,
    toon,
    cached,
    confidence,
  });
}
```

---

## 4. Template Hybrid System

### 4.1 Template Matching

```typescript
// lib/templates/matcher.ts

import { type TOONSpec } from '@/lib/toon/dictionary';
import { templates } from './library';

export class TemplateMatcher {
  /**
   * Find best matching template for TOON spec
   */
  match(spec: TOONSpec): {
    template: Template | null;
    score: number;
    useAI: boolean;
  } {
    let bestMatch: Template | null = null;
    let bestScore = 0;
    
    for (const template of templates) {
      const score = this.calculateSimilarity(spec, template.spec);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = template;
      }
    }
    
    // Decision tree
    if (bestScore > 0.9) {
      // Perfect match - use template directly
      return { template: bestMatch, score: bestScore, useAI: false };
    } else if (bestScore > 0.7) {
      // Good match - use template + minor AI customization
      return { template: bestMatch, score: bestScore, useAI: true };
    } else {
      // Poor match - full AI generation
      return { template: null, score: bestScore, useAI: true };
    }
  }
  
  private calculateSimilarity(spec1: TOONSpec, spec2: TOONSpec): number {
    let score = 0;
    
    // Site type match (40%)
    if (spec1.siteType === spec2.siteType) {
      score += 0.4;
    }
    
    // Style match (30%)
    if (spec1.style === spec2.style) {
      score += 0.3;
    }
    
    // Component match (30%)
    const componentScore = this.componentSimilarity(
      spec1.sections,
      spec2.sections
    );
    score += 0.3 * componentScore;
    
    return score;
  }
  
  private componentSimilarity(
    sections1: Section[],
    sections2: Section[]
  ): number {
    const types1 = new Set(sections1.map(s => s.type));
    const types2 = new Set(sections2.map(s => s.type));
    
    const intersection = new Set(
      [...types1].filter(x => types2.has(x))
    );
    
    const union = new Set([...types1, ...types2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }
}
```

### 4.2 Hybrid Generation

```typescript
// lib/generators/hybrid.ts

import { ClaudeService } from '@/lib/ai/claude';
import { TemplateMatcher } from '@/lib/templates/matcher';
import { type TOONSpec } from '@/lib/toon/dictionary';

export class HybridGenerator {
  private claude = new ClaudeService();
  private matcher = new TemplateMatcher();
  
  /**
   * Generate site using template + AI hybrid approach
   */
  async generate(spec: TOONSpec): Promise<{
    code: string;
    method: 'template' | 'hybrid' | 'ai';
    cost: number;
  }> {
    // Find best matching template
    const { template, score, useAI } = this.matcher.match(spec);
    
    if (!useAI && template) {
      // Pure template (FREE)
      return {
        code: this.fillTemplate(template, spec),
        method: 'template',
        cost: 0,
      };
    }
    
    if (template && score > 0.7) {
      // Template + AI customization (~$0.02)
      const baseCode = this.fillTemplate(template, spec);
      const customPrompt = this.buildCustomizationPrompt(spec, template);
      const customized = await this.claude.iterateDesign(
        baseCode,
        customPrompt
      );
      
      return {
        code: customized,
        method: 'hybrid',
        cost: 0.02,
      };
    }
    
    // Full AI generation (~$0.08)
    const toon = this.buildTOONString(spec);
    const code = await this.claude.generateSite(toon);
    
    return {
      code,
      method: 'ai',
      cost: 0.08,
    };
  }
  
  private fillTemplate(template: Template, spec: TOONSpec): string {
    // Simple variable replacement
    let code = template.code;
    
    // Replace colors
    if (spec.colors) {
      code = code.replace(/{{color_primary}}/g, spec.colors[0] || '#3B82F6');
    }
    
    // Replace section count
    const featuresSection = spec.sections.find(s => s.type === 'f');
    if (featuresSection?.props?.count) {
      code = code.replace(
        /{{features_count}}/g,
        String(featuresSection.props.count)
      );
    }
    
    return code;
  }
  
  private buildCustomizationPrompt(
    spec: TOONSpec,
    template: Template
  ): string {
    return `Customize this template to match: style=${spec.style}, colors=${spec.colors?.join(',')}`;
  }
  
  private buildTOONString(spec: TOONSpec): string {
    // Convert spec back to TOON string
    // Implementation omitted for brevity
    return '';
  }
}
```

---

## 5. Serverless Optimizations (Vercel)

### 5.1 Edge Functions для Rate Limiting

```typescript
// middleware.ts (runs on Vercel Edge)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/generate')) {
    return NextResponse.next();
  }
  
  // Get user ID from session/auth
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  // Check rate limit
  const key = `ratelimit:${userId}`;
  const requests = await redis.incr(key);
  
  // Set expiry on first request
  if (requests === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }
  
  // Check limits based on user tier
  const limit = await getUserLimit(userId); // Get from database
  
  if (requests > limit) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: await redis.ttl(key),
      },
      { status: 429 }
    );
  }
  
  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(limit - requests));
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 5.2 Streaming Responses

```typescript
// app/api/generate-stream/route.ts

import { ClaudeService } from '@/lib/ai/claude';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  // Create a readable stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send progress updates
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: 'encoding' })}\n\n`)
      );
      
      const toon = encodeTOON(prompt);
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: 'generating', toon })}\n\n`)
      );
      
      const code = await generateCode(toon);
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: 'complete', code })}\n\n`)
      );
      
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### 5.3 Background Jobs via QStash

```typescript
// lib/queue/qstash.ts

import { Client } from '@upstash/qstash';

const client = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function queueGeneration(siteId: string, toonSpec: string) {
  await client.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/generate`,
    body: { siteId, toonSpec },
    // Retry configuration
    retries: 3,
    delay: 0,
  });
}

// app/api/jobs/generate/route.ts
export async function POST(req: Request) {
  const { siteId, toonSpec } = await req.json();
  
  // Verify this is from QStash
  const signature = req.headers.get('Upstash-Signature');
  // ... verify signature
  
  // Generate in background
  const code = await generateSite(toonSpec);
  
  // Update database
  await updateSite(siteId, { code, status: 'complete' });
  
  // Notify user via Supabase Realtime
  await notifyUser(siteId, { status: 'complete' });
  
  return new Response('OK');
}
```

---

## 6. Cost Optimization Algorithms

### 6.1 Dynamic Model Selection

```typescript
// lib/ai/model-selector.ts

export class ModelSelector {
  /**
   * Select optimal AI model based on complexity
   */
  selectModel(spec: TOONSpec, userTier: string): {
    model: string;
    estimatedCost: number;
  } {
    const complexity = this.calculateComplexity(spec);
    
    // Decision tree
    if (complexity < 50) {
      // Simple - use Haiku (cheaper, faster)
      return {
        model: 'claude-haiku-3-20240307',
        estimatedCost: 0.01,
      };
    } else if (complexity < 150) {
      // Medium - use Sonnet (balanced)
      return {
        model: 'claude-sonnet-4-20250514',
        estimatedCost: 0.08,
      };
    } else {
      // Complex
      if (userTier === 'business' || userTier === 'pro') {
        // Use Opus for premium users
        return {
          model: 'claude-opus-4-20240229',
          estimatedCost: 0.30,
        };
      } else {
        // Stick with Sonnet for free/starter
        return {
          model: 'claude-sonnet-4-20250514',
          estimatedCost: 0.08,
        };
      }
    }
  }
  
  private calculateComplexity(spec: TOONSpec): number {
    let score = 0;
    
    score += spec.sections.length * 10;
    score += spec.sections.filter(s => s.layout).length * 20;
    score += spec.sections.filter(s => s.props).length * 30;
    
    return score;
  }
}
```

### 6.2 Batch Processing

```typescript
// lib/batch/processor.ts

export class BatchProcessor {
  private queue: GenerationRequest[] = [];
  private processing = false;
  
  /**
   * Add request to batch queue
   */
  async enqueue(request: GenerationRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ ...request, resolve, reject });
      
      // Process queue if not already processing
      if (!this.processing) {
        setTimeout(() => this.processQueue(), 5000); // 5 sec delay
      }
    });
  }
  
  private async processQueue() {
    if (this.queue.length === 0) return;
    
    this.processing = true;
    
    // Group similar requests
    const groups = this.groupBySimilarity(this.queue);
    
    for (const group of groups) {
      if (group.length > 1) {
        // Batch generation for similar requests
        const code = await this.generateOnce(group[0].toonSpec);
        
        // Deliver to all requesters in group
        for (const request of group) {
          const customized = await this.minorCustomization(
            code,
            request.toonSpec
          );
          request.resolve(customized);
        }
      } else {
        // Single request - generate normally
        const code = await this.generateOnce(group[0].toonSpec);
        group[0].resolve(code);
      }
    }
    
    this.queue = [];
    this.processing = false;
  }
  
  private groupBySimilarity(
    requests: GenerationRequest[]
  ): GenerationRequest[][] {
    const groups: GenerationRequest[][] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < requests.length; i++) {
      if (used.has(i)) continue;
      
      const group = [requests[i]];
      used.add(i);
      
      for (let j = i + 1; j < requests.length; j++) {
        if (used.has(j)) continue;
        
        if (this.areSimilar(requests[i].toonSpec, requests[j].toonSpec)) {
          group.push(requests[j]);
          used.add(j);
        }
      }
      
      groups.push(group);
    }
    
    return groups;
  }
  
  private areSimilar(spec1: string, spec2: string): boolean {
    // Simplified similarity check
    const normalize = (s: string) => s.replace(/\{.*?\}/g, '');
    return normalize(spec1) === normalize(spec2);
  }
  
  private async generateOnce(toonSpec: string): Promise<string> {
    const claude = new ClaudeService();
    return claude.generateSite(toonSpec);
  }
  
  private async minorCustomization(
    baseCode: string,
    toonSpec: string
  ): Promise<string> {
    // Extract differences and apply minimal changes
    // For MVP, might just return baseCode
    return baseCode;
  }
}
```

---

## 7. Performance Monitoring

### 7.1 Metrics Collection

```typescript
// lib/analytics/metrics.ts

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class MetricsCollector {
  /**
   * Track generation metrics
   */
  async trackGeneration(metrics: {
    toonSpec: string;
    method: 'template' | 'hybrid' | 'ai';
    cost: number;
    duration: number;
    cached: boolean;
    userId: string;
  }) {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Increment counters
    await redis.hincrby(`metrics:${date}`, 'total_generations', 1);
    await redis.hincrby(`metrics:${date}`, `method_${metrics.method}`, 1);
    
    if (metrics.cached) {
      await redis.hincrby(`metrics:${date}`, 'cache_hits', 1);
    }
    
    // Track costs
    await redis.hincrbyfloat(`metrics:${date}`, 'total_cost', metrics.cost);
    
    // Track duration (for percentiles)
    await redis.zadd(`durations:${date}`, {
      score: metrics.duration,
      member: `${Date.now()}-${Math.random()}`,
    });
    
    // Expire after 90 days
    await redis.expire(`metrics:${date}`, 90 * 86400);
  }
  
  /**
   * Get daily metrics
   */
  async getDailyMetrics(date: string) {
    const metrics = await redis.hgetall(`metrics:${date}`);
    
    // Calculate cache hit rate
    const total = Number(metrics?.total_generations || 0);
    const hits = Number(metrics?.cache_hits || 0);
    const hitRate = total > 0 ? hits / total : 0;
    
    // Get duration percentiles
    const durations = await redis.zrange(`durations:${date}`, 0, -1, {
      withScores: true,
    });
    const p50 = this.percentile(durations as number[], 0.5);
    const p95 = this.percentile(durations as number[], 0.95);
    
    return {
      totalGenerations: total,
      cacheHitRate: hitRate,
      averageCost: Number(metrics?.total_cost || 0) / total,
      methodBreakdown: {
        template: Number(metrics?.method_template || 0),
        hybrid: Number(metrics?.method_hybrid || 0),
        ai: Number(metrics?.method_ai || 0),
      },
      performance: {
        p50,
        p95,
      },
    };
  }
  
  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }
}
```

### 7.2 Alerting System

```typescript
// app/api/cron/check-metrics/route.ts

import { MetricsCollector } from '@/lib/analytics/metrics';
import { sendAlert } from '@/lib/alerts';

export async function GET() {
  const collector = new MetricsCollector();
  const today = new Date().toISOString().split('T')[0];
  const metrics = await collector.getDailyMetrics(today);
  
  // Check thresholds
  const alerts: string[] = [];
  
  if (metrics.cacheHitRate < 0.3) {
    alerts.push(`Cache hit rate low: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
  }
  
  if (metrics.averageCost > 0.12) {
    alerts.push(`Average cost high: $${metrics.averageCost.toFixed(3)}`);
  }
  
  if (metrics.performance.p95 > 30000) { // 30 seconds
    alerts.push(`P95 latency high: ${(metrics.performance.p95 / 1000).toFixed(1)}s`);
  }
  
  // Send alerts if any
  if (alerts.length > 0) {
    await sendAlert({
      level: 'warning',
      title: 'Performance degradation detected',
      messages: alerts,
    });
  }
  
  return Response.json({ alerts, metrics });
}
```

---

## 8. Summary & Best Practices (Next.js)

### 8.1 Optimization Checklist

```
✅ TOON Implementation
   └── 67% token savings on every request

✅ Multi-layer Caching (Upstash Redis)
   └── Target 40%+ cache hit rate

✅ Prompt Caching (Claude)
   └── 90% discount on system prompts

✅ Template Hybrid System
   └── 80% cost savings on common patterns

✅ Edge Functions (Vercel)
   └── Sub-50ms global latency for rate limiting

✅ Serverless Architecture
   └── $0-30/мес infrastructure costs

✅ Streaming Responses
   └── Better UX, perceived performance

✅ Background Jobs (QStash)
   └── No blocking on long operations

✅ Metrics & Monitoring
   └── Track costs, performance, cache hits

✅ Alerting
   └── Proactive problem detection
```

### 8.2 Expected Performance

```
Average Generation Time:
├── Cache hit: <1 second
├── Template: 2-3 seconds
├── Hybrid: 5-8 seconds
└── Full AI: 10-15 seconds

Average Cost per Generation:
├── Pure template: $0.00
├── With cache: $0.03
├── Hybrid: $0.05
└── Full AI: $0.08

Cache Hit Rate:
├── Target: 40%
├── Good: 30-50%
└── Excellent: >50%

Infrastructure Costs:
├── MVP (0-500 users): $0-10/мес
├── Growth (500-2K users): $10-30/мес
└── Scale (2K-10K users): $30-100/мес
```

### 8.3 Next.js Specific Benefits

```
✅ No server management (serverless)
✅ Automatic scaling (0 to millions)
✅ Global CDN included (Vercel Edge)
✅ Zero cold starts (Edge Functions)
✅ Built-in caching (ISR, SWR)
✅ TypeScript everywhere
✅ Easy deployment (git push)
✅ Free for MVP (Hobby tier)
```

---

**Дата создания**: 2025-11-17  
**Версия**: 2.0 (Next.js/TypeScript)  
**Stack**: Vercel + Supabase + Upstash  
**Target costs**: $0.03-0.08 per generation
