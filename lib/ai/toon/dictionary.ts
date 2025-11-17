/**
 * TOON Dictionary
 * Compact notation system for website structure representation
 */

export const TOON_DICTIONARY = {
  siteTypes: {
    lp: 'landing_page',
    pf: 'portfolio',
    ec: 'ecommerce',
    bl: 'blog',
    da: 'dashboard',
    ap: 'app',
  },

  styles: {
    min: 'minimalist',
    cor: 'corporate',
    cre: 'creative',
    mod: 'modern',
    lux: 'luxury',
    tec: 'tech',
    pla: 'playful',
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
    fa: 'faq',
    ab: 'about',
    st: 'stats',
    cl: 'clients',
    bl: 'blog_section',
    cta: 'call_to_action',
    fm: 'form',
  },

  layouts: {
    hero: {
      spl: 'split',
      ctr: 'centered',
      fl: 'fullwidth',
      vid: 'video',
      img: 'image_bg',
    },
    features: {
      gr2: 'grid_2col',
      gr3: 'grid_3col',
      gr4: 'grid_4col',
      ls: 'list',
      crds: 'cards',
    },
    gallery: {
      mas: 'masonry',
      gr: 'grid',
      car: 'carousel',
    },
    pricing: {
      cmp: 'comparison',
      crds: 'cards',
      tab: 'table',
    },
  },

  colors: {
    w: '#FFFFFF',
    b: '#000000',
    bl: '#3B82F6',
    rd: '#EF4444',
    gr: '#10B981',
    yl: '#F59E0B',
    pr: '#A855F7',
    pk: '#EC4899',
    tn: '#14B8A6',
    in: '#6366F1',
    or: '#F97316',
    gy: '#6B7280',
  },

  sizes: {
    xs: 'extra_small',
    sm: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra_large',
  },
} as const;

/**
 * TypeScript types for TOON specification
 */
export type SiteType = keyof typeof TOON_DICTIONARY.siteTypes;
export type StyleType = keyof typeof TOON_DICTIONARY.styles;
export type ComponentType = keyof typeof TOON_DICTIONARY.components;
export type SizeType = keyof typeof TOON_DICTIONARY.sizes;
export type ColorKey = keyof typeof TOON_DICTIONARY.colors;

export type Section = {
  type: ComponentType;
  layout?: string;
  size?: SizeType;
  props?: Record<string, any>;
};

export type TOONSpec = {
  siteType: SiteType;
  style?: StyleType;
  sections: Section[];
  colors?: ColorKey[];
  customColors?: string[];
};

/**
 * Helper functions for TOON dictionary
 */
export const TOONHelper = {
  /**
   * Get full name from TOON abbreviation
   */
  getSiteTypeName(key: SiteType): string {
    return TOON_DICTIONARY.siteTypes[key];
  },

  getStyleName(key: StyleType): string {
    return TOON_DICTIONARY.styles[key];
  },

  getComponentName(key: ComponentType): string {
    return TOON_DICTIONARY.components[key];
  },

  /**
   * Get color hex from key
   */
  getColor(key: ColorKey): string {
    return TOON_DICTIONARY.colors[key];
  },

  /**
   * Check if a key exists in dictionary
   */
  isValidSiteType(key: string): key is SiteType {
    return key in TOON_DICTIONARY.siteTypes;
  },

  isValidStyle(key: string): key is StyleType {
    return key in TOON_DICTIONARY.styles;
  },

  isValidComponent(key: string): key is ComponentType {
    return key in TOON_DICTIONARY.components;
  },

  isValidColor(key: string): key is ColorKey {
    return key in TOON_DICTIONARY.colors;
  },

  /**
   * Get all available options
   */
  getAllSiteTypes(): SiteType[] {
    return Object.keys(TOON_DICTIONARY.siteTypes) as SiteType[];
  },

  getAllStyles(): StyleType[] {
    return Object.keys(TOON_DICTIONARY.styles) as StyleType[];
  },

  getAllComponents(): ComponentType[] {
    return Object.keys(TOON_DICTIONARY.components) as ComponentType[];
  },

  getAllColors(): ColorKey[] {
    return Object.keys(TOON_DICTIONARY.colors) as ColorKey[];
  },
};

/**
 * Common TOON patterns for quick matching
 */
export const COMMON_PATTERNS = {
  // Landing pages
  'minimal_landing': 'lp{st:min|s:[h{ly:ctr}|f{ly:gr3}|cta]}',
  'corporate_landing': 'lp{st:cor|s:[h{ly:spl}|f{ly:gr4}|tm|pr|ct]}',
  'product_landing': 'lp{st:mod|s:[h{ly:vid}|f{ly:crds}|st|pr{ly:cmp}|cta]}',

  // Portfolios
  'creative_portfolio': 'pf{st:cre|s:[h{ly:fl}|g{ly:mas}|ab|ct]}',
  'minimal_portfolio': 'pf{st:min|s:[h{ly:ctr}|g{ly:gr}|ab|ct]}',

  // Blogs
  'minimal_blog': 'bl{st:min|s:[h{ly:ctr}|bl{ly:ls}|ft]}',
  'magazine_blog': 'bl{st:mod|s:[h{ly:img}|bl{ly:gr3}|ft]}',
};

/**
 * Validation rules for TOON specs
 */
export const VALIDATION_RULES = {
  minSections: 1,
  maxSections: 10,
  requiredSections: {
    lp: ['h'], // Landing page must have hero
    pf: ['h', 'g'], // Portfolio must have hero and gallery
    bl: ['h', 'bl'], // Blog must have hero and blog section
  },
  recommendedSections: {
    lp: ['h', 'f', 'cta'],
    pf: ['h', 'g', 'ab', 'ct'],
    bl: ['h', 'bl', 'ft'],
    ec: ['h', 'f', 'pr', 'tm', 'ct'],
  },
};
