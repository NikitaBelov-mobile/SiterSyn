import { templateMatcher, TemplateMatch } from '@/lib/templates/matcher'
import { getClaudeService } from '@/lib/ai/claude'

/**
 * Generation method
 */
export type GenerationMethod = 'template' | 'hybrid' | 'ai'

/**
 * Generation decision result
 */
export interface GenerationDecision {
  method: GenerationMethod
  reason: string
  estimatedCost: number
  templateMatch?: TemplateMatch
}

/**
 * Generation result
 */
export interface GenerationResult {
  code: string
  method: GenerationMethod
  cost: number
  templateUsed?: string
}

/**
 * Hybrid Generator
 * Intelligently chooses between template, hybrid, or full AI generation
 */
export class HybridGenerator {
  /**
   * Cost estimates (in dollars)
   */
  private readonly COSTS = {
    TEMPLATE: 0.0, // Free
    HYBRID: 0.02, // ~$0.02 (small AI modification)
    AI_FULL: 0.08, // ~$0.08 (full generation)
  }

  /**
   * Confidence thresholds
   */
  private readonly THRESHOLDS = {
    TEMPLATE_CONFIDENCE: 0.8, // Use pure template if >= 0.8
    HYBRID_CONFIDENCE: 0.6, // Use hybrid if >= 0.6
  }

  /**
   * Decide which generation method to use
   */
  async decide(spec: any, userPrompt?: string): Promise<GenerationDecision> {
    // Try to find matching template
    const bestMatch = templateMatcher.findBestMatch(spec)

    if (!bestMatch) {
      // No template match, use full AI
      return {
        method: 'ai',
        reason: 'No matching template found',
        estimatedCost: this.COSTS.AI_FULL,
      }
    }

    // High confidence match - use pure template
    if (bestMatch.confidence >= this.THRESHOLDS.TEMPLATE_CONFIDENCE) {
      return {
        method: 'template',
        reason: `High confidence template match (${(bestMatch.confidence * 100).toFixed(0)}%)`,
        estimatedCost: this.COSTS.TEMPLATE,
        templateMatch: bestMatch,
      }
    }

    // Medium confidence - use hybrid approach
    if (bestMatch.confidence >= this.THRESHOLDS.HYBRID_CONFIDENCE) {
      return {
        method: 'hybrid',
        reason: `Medium confidence template match (${(bestMatch.confidence * 100).toFixed(0)}%), will customize with AI`,
        estimatedCost: this.COSTS.HYBRID,
        templateMatch: bestMatch,
      }
    }

    // Low confidence - use full AI
    return {
      method: 'ai',
      reason: `Low template confidence (${(bestMatch.confidence * 100).toFixed(0)}%), using full AI generation`,
      estimatedCost: this.COSTS.AI_FULL,
    }
  }

  /**
   * Generate site code using the decided method
   */
  async generate(
    spec: any,
    decision: GenerationDecision,
    userPrompt?: string
  ): Promise<GenerationResult> {
    switch (decision.method) {
      case 'template':
        return this.generateFromTemplate(decision.templateMatch!)

      case 'hybrid':
        return this.generateHybrid(decision.templateMatch!, userPrompt)

      case 'ai':
        return this.generateWithAI(spec, userPrompt)

      default:
        throw new Error(`Unknown generation method: ${decision.method}`)
    }
  }

  /**
   * Generate from pure template
   */
  private async generateFromTemplate(
    match: TemplateMatch
  ): Promise<GenerationResult> {
    const { template } = match

    // Extract variables from spec or use defaults
    const variables: Record<string, string> = {}

    // Apply template with variables
    const code = templateMatcher.applyTemplate(template, variables)

    return {
      code,
      method: 'template',
      cost: this.COSTS.TEMPLATE,
      templateUsed: template.id,
    }
  }

  /**
   * Generate using hybrid approach (template + AI customization)
   */
  private async generateHybrid(
    match: TemplateMatch,
    userPrompt?: string
  ): Promise<GenerationResult> {
    const { template } = match

    // Start with template
    const baseCode = templateMatcher.applyTemplate(template, {})

    // Use AI to customize based on user prompt
    const claude = getClaudeService()

    const customizationPrompt = `
You have a base template. Customize it according to the user's request while maintaining the overall structure.

Base template:
\`\`\`tsx
${baseCode}
\`\`\`

User request: ${userPrompt || 'Make it look professional and modern'}

Modify the template to match the user's needs. Keep the structure but adjust:
- Text content
- Colors and styling
- Layout details
- Any specific features requested

Return only the modified React component code.
`

    const result = await claude.iterateDesign(baseCode, customizationPrompt)

    return {
      code: result.code,
      method: 'hybrid',
      cost: result.cost || this.COSTS.HYBRID,
      templateUsed: template.id,
    }
  }

  /**
   * Generate using full AI
   */
  private async generateWithAI(
    spec: any,
    userPrompt?: string
  ): Promise<GenerationResult> {
    const claude = getClaudeService()

    // Convert spec to TOON string if needed
    const toonSpec =
      typeof spec === 'string' ? spec : this.specToTOON(spec)

    const result = await claude.generateSite(toonSpec)

    return {
      code: result.code,
      method: 'ai',
      cost: result.cost || this.COSTS.AI_FULL,
    }
  }

  /**
   * Convert spec object to TOON string
   */
  private specToTOON(spec: any): string {
    const parts: string[] = []

    // Site type
    parts.push(spec.siteType || 'lp')

    // Style
    if (spec.style) {
      parts.push(`st:${spec.style}`)
    }

    // Sections
    if (spec.sections && spec.sections.length > 0) {
      const sectionStrs = spec.sections.map((s: any) => {
        if (typeof s === 'string') return s
        let str = s.type
        if (s.layout) str += `{ly:${s.layout}}`
        return str
      })
      parts.push(`s:[${sectionStrs.join('|')}]`)
    }

    return `${parts[0]}{${parts.slice(1).join('|')}}`
  }

  /**
   * Calculate cost savings compared to full AI
   */
  calculateSavings(method: GenerationMethod): {
    savedCost: number
    savedPercent: number
  } {
    const fullCost = this.COSTS.AI_FULL
    const actualCost =
      method === 'template'
        ? this.COSTS.TEMPLATE
        : method === 'hybrid'
          ? this.COSTS.HYBRID
          : this.COSTS.AI_FULL

    return {
      savedCost: fullCost - actualCost,
      savedPercent: ((fullCost - actualCost) / fullCost) * 100,
    }
  }
}

/**
 * Singleton instance
 */
export const hybridGenerator = new HybridGenerator()
