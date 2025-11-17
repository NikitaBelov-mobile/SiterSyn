// Database types
export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  credits: number
  tier: 'free' | 'starter' | 'pro' | 'business'
  created_at: string
  updated_at: string
}

export type Site = {
  id: string
  user_id: string
  title: string
  slug: string
  code: string | null
  toon_spec: string | null
  thumbnail_url: string | null
  status: 'draft' | 'published'
  custom_domain: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Generation = {
  id: string
  user_id: string
  site_id: string | null
  toon_spec: string
  method: 'template' | 'hybrid' | 'ai'
  cost: number
  duration: number
  cached: boolean
  created_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  amount: number
  type: 'generation' | 'purchase' | 'refund' | 'subscription'
  description: string | null
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  tier: 'starter' | 'pro' | 'business'
  status: 'active' | 'canceled' | 'past_due'
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// TOON types
export type TOONSpec = {
  siteType: 'lp' | 'pf' | 'ec' | 'bl'
  style?: 'min' | 'cor' | 'cre' | 'mod'
  sections: TOONSection[]
  colors?: string[]
}

export type TOONSection = {
  type: 'h' | 'f' | 'g' | 'ct' | 'ft' | 'nav' | 'pr' | 'tm'
  layout?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  props?: Record<string, any>
}

// API response types
export type GenerateResponse = {
  site: Site
  toon: string
  confidence: number
}

export type ErrorResponse = {
  error: string
}
