import { Template, templates } from './library'
import { TOONSpec } from '@/lib/ai/toon/dictionary'

/**
 * Template match result
 */
export interface TemplateMatch {
  template: Template
  score: number
  confidence: number
}

/**
 * Template Matcher
 * Matches TOON specs to existing templates
 */
export class TemplateMatcher {
  /**
   * Find best matching template for a TOON spec
   */
  findBestMatch(spec: any): TemplateMatch | null {
    const matches = this.findMatches(spec)

    if (matches.length === 0) {
      return null
    }

    // Return highest scoring match
    return matches[0]
  }

  /**
   * Find all matching templates sorted by score
   */
  findMatches(spec: any): TemplateMatch[] {
    const matches: TemplateMatch[] = []

    for (const template of templates) {
      const score = this.calculateMatchScore(spec, template.spec)

      if (score > 0) {
        matches.push({
          template,
          score,
          confidence: this.scoreToConfidence(score),
        })
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score)

    return matches
  }

  /**
   * Calculate match score between spec and template
   * Score ranges from 0-100
   */
  private calculateMatchScore(spec: any, templateSpec: any): number {
    let score = 0
    let maxScore = 0

    // Site type match (40 points)
    maxScore += 40
    if (spec.siteType === templateSpec.siteType) {
      score += 40
    }

    // Style match (20 points)
    maxScore += 20
    if (spec.style && templateSpec.style) {
      if (spec.style === templateSpec.style) {
        score += 20
      }
    } else if (!spec.style && !templateSpec.style) {
      score += 10 // Partial credit if both don't specify style
    }

    // Sections match (40 points)
    maxScore += 40
    if (spec.sections && templateSpec.sections) {
      const sectionScore = this.calculateSectionScore(
        spec.sections,
        templateSpec.sections
      )
      score += sectionScore * 40
    }

    // Normalize to 0-100
    return maxScore > 0 ? (score / maxScore) * 100 : 0
  }

  /**
   * Calculate section similarity score (0-1)
   */
  private calculateSectionScore(
    specSections: any[],
    templateSections: any[]
  ): number {
    if (specSections.length === 0 || templateSections.length === 0) {
      return 0
    }

    // Extract section types
    const specTypes = specSections.map((s) => s.type || s)
    const templateTypes = templateSections.map((s) => s.type || s)

    // Count matches (order doesn't matter for now)
    let matches = 0
    const specTypesSet = new Set(specTypes)
    const templateTypesSet = new Set(templateTypes)

    for (const type of specTypesSet) {
      if (templateTypesSet.has(type)) {
        matches++
      }
    }

    // Calculate Jaccard similarity
    const union = new Set([...specTypes, ...templateTypes])
    return matches / union.size
  }

  /**
   * Convert score to confidence level
   */
  private scoreToConfidence(score: number): number {
    // Map 0-100 score to 0-1 confidence
    // Apply non-linear scaling to be more selective
    if (score >= 80) return 0.9
    if (score >= 70) return 0.8
    if (score >= 60) return 0.7
    if (score >= 50) return 0.6
    return score / 100
  }

  /**
   * Check if template is a good match
   * Returns true if confidence >= 0.7
   */
  isGoodMatch(match: TemplateMatch): boolean {
    return match.confidence >= 0.7
  }

  /**
   * Apply template with variable substitution
   */
  applyTemplate(
    template: Template,
    variables: Record<string, string>
  ): string {
    let code = template.code

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      code = code.replace(new RegExp(placeholder, 'g'), value)
    }

    // Replace any remaining variables with defaults
    for (const variable of template.variables) {
      const placeholder = `{{${variable}}}`
      if (code.includes(placeholder)) {
        code = code.replace(
          new RegExp(placeholder, 'g'),
          this.getDefaultValue(variable)
        )
      }
    }

    return code
  }

  /**
   * Get default value for a variable
   */
  private getDefaultValue(variable: string): string {
    const defaults: Record<string, string> = {
      title: 'Welcome to Your Site',
      subtitle: 'Create something amazing',
      cta_text: 'Get Started',
      name: 'Your Name',
      role: 'Designer & Developer',
      bio: 'Creating beautiful digital experiences',
    }

    return defaults[variable] || `{${variable}}`
  }
}

/**
 * Singleton instance
 */
export const templateMatcher = new TemplateMatcher()
