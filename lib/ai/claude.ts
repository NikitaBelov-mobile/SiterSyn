/**
 * Claude API Integration
 * Handles communication with Anthropic Claude API for site generation
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  buildGenerationPrompt,
  buildIterationPrompt,
  TOON_DICTIONARY_PROMPT,
  SYSTEM_PROMPT,
} from './prompts';

export interface GenerationResult {
  code: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  model: string;
  cost: number;
}

export interface IterationResult {
  code: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  cost: number;
}

export class ClaudeService {
  private client: Anthropic;
  private model: string;
  private maxTokens: number;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!,
    });
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4096;
  }

  /**
   * Generate a site from TOON specification
   */
  async generateSite(toonSpec: string): Promise<GenerationResult> {
    const prompt = buildGenerationPrompt(toonSpec);

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: [
              // System prompt with caching
              {
                type: 'text',
                text: SYSTEM_PROMPT,
                cache_control: { type: 'ephemeral' },
              },
              // TOON dictionary with caching
              {
                type: 'text',
                text: TOON_DICTIONARY_PROMPT,
                cache_control: { type: 'ephemeral' },
              },
              // Actual generation request
              {
                type: 'text',
                text: `Generate a React component based on this TOON specification:\n\n**TOON Spec**: \`${toonSpec}\`\n\nGenerate production-ready code following all guidelines above.`,
              },
            ],
          },
        ],
      });

      // Extract code from response
      const code = this.extractCode(response.content[0].text);

      // Calculate cost
      const cost = this.calculateCost(response.usage);

      return {
        code,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          cache_creation_input_tokens:
            response.usage.cache_creation_input_tokens,
          cache_read_input_tokens: response.usage.cache_read_input_tokens,
        },
        model: response.model,
        cost,
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(
        `Failed to generate site: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Iterate on existing design
   */
  async iterateDesign(
    currentCode: string,
    instruction: string
  ): Promise<IterationResult> {
    const prompt = buildIterationPrompt(currentCode, instruction);

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const code = this.extractCode(response.content[0].text);
      const cost = this.calculateCost(response.usage);

      return {
        code,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          cache_creation_input_tokens:
            response.usage.cache_creation_input_tokens,
          cache_read_input_tokens: response.usage.cache_read_input_tokens,
        },
        cost,
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(
        `Failed to iterate design: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Extract code from Claude's response
   */
  private extractCode(text: string): string {
    // Try to match TypeScript/TSX code blocks
    const tsxMatch = text.match(/```(?:tsx|typescript|ts|jsx|javascript|js)\n([\s\S]*?)\n```/);
    if (tsxMatch) {
      return tsxMatch[1].trim();
    }

    // Try to match any code block
    const codeMatch = text.match(/```\n([\s\S]*?)\n```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }

    // If no code block, try to find export default
    const exportMatch = text.match(/export default function[\s\S]*/);
    if (exportMatch) {
      return exportMatch[0].trim();
    }

    // Last resort: return the whole text
    console.warn('Could not extract code block, returning full text');
    return text.trim();
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  }): number {
    // Claude Sonnet 4 pricing (as of 2024)
    // Input: $3 per million tokens
    // Output: $15 per million tokens
    // Cache write: $3.75 per million tokens
    // Cache read: $0.30 per million tokens

    const inputCost = (usage.input_tokens / 1_000_000) * 3.0;
    const outputCost = (usage.output_tokens / 1_000_000) * 15.0;
    const cacheWriteCost =
      ((usage.cache_creation_input_tokens || 0) / 1_000_000) * 3.75;
    const cacheReadCost =
      ((usage.cache_read_input_tokens || 0) / 1_000_000) * 0.3;

    return inputCost + outputCost + cacheWriteCost + cacheReadCost;
  }

  /**
   * Validate generated code (basic checks)
   */
  validateCode(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if code starts with export default
    if (!code.includes('export default')) {
      errors.push('Code must include "export default"');
    }

    // Check if code has a component function
    if (
      !code.includes('function') &&
      !code.includes('const') &&
      !code.includes('=>')
    ) {
      errors.push('Code must define a function component');
    }

    // Check for return statement
    if (!code.includes('return')) {
      errors.push('Component must have a return statement');
    }

    // Check for JSX
    if (!code.includes('<') || !code.includes('>')) {
      errors.push('Component must return JSX');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Test connection to Claude API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
      });

      return response.content.length > 0;
    } catch (error) {
      console.error('Claude API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      'claude-sonnet-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  /**
   * Set model to use
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Set max tokens
   */
  setMaxTokens(maxTokens: number): void {
    this.maxTokens = maxTokens;
  }
}

/**
 * Singleton instance
 */
let claudeInstance: ClaudeService | null = null;

export function getClaudeService(apiKey?: string): ClaudeService {
  if (!claudeInstance) {
    claudeInstance = new ClaudeService(apiKey);
  }
  return claudeInstance;
}
