/**
 * TOON Encoder
 * Converts natural language prompts into TOON specifications
 */

import {
  TOON_DICTIONARY,
  TOONHelper,
  COMMON_PATTERNS,
  VALIDATION_RULES,
  type TOONSpec,
  type Section,
  type SiteType,
  type StyleType,
  type ComponentType,
} from './dictionary';

export interface EncodingResult {
  toon: string;
  spec: TOONSpec;
  confidence: number;
  method: 'pattern' | 'extracted' | 'fallback';
  warnings?: string[];
}

export class TOONEncoder {
  private keywords = {
    siteTypes: {
      landing: 'lp',
      'landing page': 'lp',
      portfolio: 'pf',
      ecommerce: 'ec',
      'e-commerce': 'ec',
      shop: 'ec',
      store: 'ec',
      blog: 'bl',
      dashboard: 'da',
      app: 'ap',
      application: 'ap',
    },
    styles: {
      minimal: 'min',
      minimalist: 'min',
      minimalistic: 'min',
      corporate: 'cor',
      professional: 'cor',
      business: 'cor',
      creative: 'cre',
      artistic: 'cre',
      modern: 'mod',
      contemporary: 'mod',
      luxury: 'lux',
      premium: 'lux',
      elegant: 'lux',
      tech: 'tec',
      technical: 'tec',
      playful: 'pla',
      fun: 'pla',
    },
    components: {
      hero: 'h',
      header: 'h',
      features: 'f',
      feature: 'f',
      gallery: 'g',
      images: 'g',
      photos: 'g',
      contact: 'ct',
      'contact form': 'ct',
      footer: 'ft',
      navigation: 'nav',
      menu: 'nav',
      nav: 'nav',
      pricing: 'pr',
      price: 'pr',
      plans: 'pr',
      testimonials: 'tm',
      testimonial: 'tm',
      reviews: 'tm',
      faq: 'fa',
      'frequently asked': 'fa',
      about: 'ab',
      'about us': 'ab',
      stats: 'st',
      statistics: 'st',
      numbers: 'st',
      clients: 'cl',
      partners: 'cl',
      blog: 'bl',
      'blog section': 'bl',
      articles: 'bl',
      cta: 'cta',
      'call to action': 'cta',
      form: 'fm',
    },
    layouts: {
      split: 'spl',
      centered: 'ctr',
      center: 'ctr',
      fullwidth: 'fl',
      'full width': 'fl',
      video: 'vid',
      grid: 'gr',
      '2 columns': 'gr2',
      '3 columns': 'gr3',
      '4 columns': 'gr4',
      list: 'ls',
      cards: 'crds',
      masonry: 'mas',
      carousel: 'car',
      slider: 'car',
    },
  };

  /**
   * Main encoding method
   */
  encode(prompt: string): EncodingResult {
    const normalized = this.normalizePrompt(prompt);

    // Try pattern matching first
    const patternResult = this.tryPatternMatch(normalized);
    if (patternResult) {
      return patternResult;
    }

    // Extract from prompt
    return this.extractFromPrompt(normalized);
  }

  /**
   * Normalize prompt for processing
   */
  private normalizePrompt(prompt: string): string {
    return prompt.toLowerCase().trim();
  }

  /**
   * Try to match against common patterns
   */
  private tryPatternMatch(prompt: string): EncodingResult | null {
    const patterns: Record<string, string> = {};

    // Check for minimal landing
    if (
      (prompt.includes('minimal') || prompt.includes('simple')) &&
      (prompt.includes('landing') || prompt.includes('page'))
    ) {
      patterns['minimal_landing'] = COMMON_PATTERNS['minimal_landing'];
    }

    // Check for corporate landing
    if (
      (prompt.includes('corporate') || prompt.includes('professional')) &&
      (prompt.includes('landing') || prompt.includes('page'))
    ) {
      patterns['corporate_landing'] = COMMON_PATTERNS['corporate_landing'];
    }

    // Check for product landing
    if (
      prompt.includes('product') &&
      (prompt.includes('landing') || prompt.includes('page'))
    ) {
      patterns['product_landing'] = COMMON_PATTERNS['product_landing'];
    }

    // Check for creative portfolio
    if (
      (prompt.includes('creative') || prompt.includes('artistic')) &&
      prompt.includes('portfolio')
    ) {
      patterns['creative_portfolio'] = COMMON_PATTERNS['creative_portfolio'];
    }

    // Check for minimal portfolio
    if (
      (prompt.includes('minimal') || prompt.includes('simple')) &&
      prompt.includes('portfolio')
    ) {
      patterns['minimal_portfolio'] = COMMON_PATTERNS['minimal_portfolio'];
    }

    if (Object.keys(patterns).length > 0) {
      const patternKey = Object.keys(patterns)[0];
      const toonString = patterns[patternKey];
      const spec = this.parseTOONString(toonString);

      return {
        toon: toonString,
        spec,
        confidence: 0.9,
        method: 'pattern',
      };
    }

    return null;
  }

  /**
   * Extract TOON spec from prompt
   */
  private extractFromPrompt(prompt: string): EncodingResult {
    const warnings: string[] = [];

    // Extract site type
    const siteType = this.extractSiteType(prompt);
    if (!siteType) {
      warnings.push('Could not determine site type, defaulting to landing page');
    }

    // Extract style
    const style = this.extractStyle(prompt);

    // Extract sections
    const sections = this.extractSections(prompt, siteType || 'lp');

    // Build spec
    const spec: TOONSpec = {
      siteType: siteType || 'lp',
      style,
      sections,
    };

    // Validate and adjust
    this.validateAndAdjust(spec, warnings);

    // Build TOON string
    const toonString = this.buildTOONString(spec);

    // Calculate confidence
    const confidence = this.calculateConfidence(spec, prompt, warnings);

    return {
      toon: toonString,
      spec,
      confidence,
      method: 'extracted',
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Extract site type from prompt
   */
  private extractSiteType(prompt: string): SiteType | null {
    for (const [keyword, code] of Object.entries(this.keywords.siteTypes)) {
      if (prompt.includes(keyword)) {
        return code as SiteType;
      }
    }
    return null;
  }

  /**
   * Extract style from prompt
   */
  private extractStyle(prompt: string): StyleType | undefined {
    for (const [keyword, code] of Object.entries(this.keywords.styles)) {
      if (prompt.includes(keyword)) {
        return code as StyleType;
      }
    }
    return undefined;
  }

  /**
   * Extract sections from prompt
   */
  private extractSections(prompt: string, siteType: SiteType): Section[] {
    const sections: Section[] = [];
    const foundComponents = new Set<string>();

    // Extract components
    for (const [keyword, code] of Object.entries(this.keywords.components)) {
      if (prompt.includes(keyword) && !foundComponents.has(code)) {
        foundComponents.add(code);

        // Try to extract layout
        let layout: string | undefined;
        for (const [layoutKeyword, layoutCode] of Object.entries(
          this.keywords.layouts
        )) {
          if (prompt.includes(layoutKeyword)) {
            layout = layoutCode;
            break;
          }
        }

        sections.push({
          type: code as ComponentType,
          layout,
        });
      }
    }

    // If no sections found, use recommended sections
    if (sections.length === 0) {
      const recommended = VALIDATION_RULES.recommendedSections[siteType];
      if (recommended) {
        sections.push(
          ...recommended.map((type) => ({
            type: type as ComponentType,
          }))
        );
      }
    }

    // Ensure required sections are present
    const required = VALIDATION_RULES.requiredSections[siteType];
    if (required) {
      for (const reqType of required) {
        if (!sections.some((s) => s.type === reqType)) {
          sections.unshift({ type: reqType as ComponentType });
        }
      }
    }

    return sections;
  }

  /**
   * Validate and adjust spec
   */
  private validateAndAdjust(spec: TOONSpec, warnings: string[]): void {
    // Check section count
    if (spec.sections.length < VALIDATION_RULES.minSections) {
      warnings.push('Too few sections, adding recommended sections');
      const recommended =
        VALIDATION_RULES.recommendedSections[spec.siteType] || ['h', 'f', 'ct'];
      spec.sections = recommended.map((type) => ({
        type: type as ComponentType,
      }));
    }

    if (spec.sections.length > VALIDATION_RULES.maxSections) {
      warnings.push('Too many sections, limiting to 10');
      spec.sections = spec.sections.slice(0, VALIDATION_RULES.maxSections);
    }

    // Ensure hero is first (except for footer-only pages)
    const heroIndex = spec.sections.findIndex((s) => s.type === 'h');
    if (heroIndex > 0) {
      const [hero] = spec.sections.splice(heroIndex, 1);
      spec.sections.unshift(hero);
    }

    // Ensure footer is last if present
    const footerIndex = spec.sections.findIndex((s) => s.type === 'ft');
    if (footerIndex >= 0 && footerIndex < spec.sections.length - 1) {
      const [footer] = spec.sections.splice(footerIndex, 1);
      spec.sections.push(footer);
    }
  }

  /**
   * Build TOON string from spec
   */
  private buildTOONString(spec: TOONSpec): string {
    let result = spec.siteType;
    const props: string[] = [];

    // Add style
    if (spec.style) {
      props.push(`st:${spec.style}`);
    }

    // Add sections
    if (spec.sections.length > 0) {
      const sectionsStr = spec.sections
        .map((section) => {
          let sectionStr = section.type;
          if (section.layout) {
            sectionStr += `{ly:${section.layout}}`;
          }
          return sectionStr;
        })
        .join('|');
      props.push(`s:[${sectionsStr}]`);
    }

    if (props.length > 0) {
      result += `{${props.join('|')}}`;
    }

    return result;
  }

  /**
   * Parse TOON string back to spec
   */
  private parseTOONString(toon: string): TOONSpec {
    // Simple parser for basic TOON strings
    // Example: lp{st:min|s:[h{ly:ctr}|f{ly:gr3}|cta]}

    const match = toon.match(/^(\w+)(?:\{(.+)\})?$/);
    if (!match) {
      throw new Error('Invalid TOON string format');
    }

    const [, siteType, propsStr] = match;
    const spec: TOONSpec = {
      siteType: siteType as SiteType,
      sections: [],
    };

    if (propsStr) {
      // Parse properties
      const props = this.parseProperties(propsStr);

      if (props.st) {
        spec.style = props.st as StyleType;
      }

      if (props.s) {
        // Parse sections array
        const sectionsMatch = props.s.match(/\[(.+)\]/);
        if (sectionsMatch) {
          const sectionsStr = sectionsMatch[1];
          spec.sections = this.parseSections(sectionsStr);
        }
      }
    }

    return spec;
  }

  /**
   * Parse properties string
   */
  private parseProperties(propsStr: string): Record<string, string> {
    const props: Record<string, string> = {};
    const parts = propsStr.split('|');

    for (const part of parts) {
      const [key, value] = part.split(':');
      if (key && value) {
        props[key] = value;
      }
    }

    return props;
  }

  /**
   * Parse sections string
   */
  private parseSections(sectionsStr: string): Section[] {
    const sections: Section[] = [];
    const parts = sectionsStr.split('|');

    for (const part of parts) {
      const match = part.match(/^(\w+)(?:\{(.+)\})?$/);
      if (match) {
        const [, type, layoutStr] = match;
        const section: Section = {
          type: type as ComponentType,
        };

        if (layoutStr) {
          const layoutMatch = layoutStr.match(/ly:(\w+)/);
          if (layoutMatch) {
            section.layout = layoutMatch[1];
          }
        }

        sections.push(section);
      }
    }

    return sections;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    spec: TOONSpec,
    prompt: string,
    warnings: string[]
  ): number {
    let confidence = 1.0;

    // Reduce confidence for warnings
    confidence -= warnings.length * 0.1;

    // Reduce confidence if no style specified
    if (!spec.style) {
      confidence -= 0.1;
    }

    // Reduce confidence if using fallback sections
    const recommended = VALIDATION_RULES.recommendedSections[spec.siteType];
    if (
      recommended &&
      spec.sections.every((s) => recommended.includes(s.type))
    ) {
      confidence -= 0.15;
    }

    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Encode with explicit parameters (for programmatic use)
   */
  encodeExplicit(params: {
    siteType: SiteType;
    style?: StyleType;
    sections: ComponentType[];
    layouts?: Record<string, string>;
  }): EncodingResult {
    const sections: Section[] = params.sections.map((type) => ({
      type,
      layout: params.layouts?.[type],
    }));

    const spec: TOONSpec = {
      siteType: params.siteType,
      style: params.style,
      sections,
    };

    const warnings: string[] = [];
    this.validateAndAdjust(spec, warnings);

    const toonString = this.buildTOONString(spec);

    return {
      toon: toonString,
      spec,
      confidence: 1.0,
      method: 'pattern',
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
}
