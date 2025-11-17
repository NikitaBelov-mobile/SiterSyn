/**
 * TOON Decoder
 * Parses TOON strings back into structured specifications
 */

import {
  TOON_DICTIONARY,
  TOONHelper,
  type TOONSpec,
  type Section,
  type SiteType,
  type StyleType,
  type ComponentType,
  type ColorKey,
} from './dictionary';

export interface DecodingResult {
  spec: TOONSpec;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class TOONDecoder {
  /**
   * Decode a TOON string into a structured spec
   */
  decode(toon: string): DecodingResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const spec = this.parse(toon, errors, warnings);

      // Validate the spec
      this.validate(spec, errors, warnings);

      return {
        spec,
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(`Failed to parse TOON string: ${error}`);
      return {
        spec: this.getDefaultSpec(),
        valid: false,
        errors,
        warnings,
      };
    }
  }

  /**
   * Parse TOON string
   */
  private parse(
    toon: string,
    errors: string[],
    warnings: string[]
  ): TOONSpec {
    // Basic format: lp{st:min|s:[h{ly:ctr}|f{ly:gr3}|cta]}
    // Or simple: lp

    const match = toon.match(/^(\w+)(?:\{(.+)\})?$/);
    if (!match) {
      throw new Error('Invalid TOON format');
    }

    const [, siteTypeCode, propsStr] = match;

    // Validate site type
    if (!TOONHelper.isValidSiteType(siteTypeCode)) {
      errors.push(`Invalid site type: ${siteTypeCode}`);
    }

    const spec: TOONSpec = {
      siteType: siteTypeCode as SiteType,
      sections: [],
    };

    if (propsStr) {
      this.parseProperties(propsStr, spec, errors, warnings);
    }

    return spec;
  }

  /**
   * Parse properties section
   */
  private parseProperties(
    propsStr: string,
    spec: TOONSpec,
    errors: string[],
    warnings: string[]
  ): void {
    // Split by | but respect nested structures
    const props = this.splitProperties(propsStr);

    for (const prop of props) {
      if (prop.startsWith('st:')) {
        // Style property
        const styleCode = prop.substring(3);
        if (!TOONHelper.isValidStyle(styleCode)) {
          errors.push(`Invalid style: ${styleCode}`);
        } else {
          spec.style = styleCode as StyleType;
        }
      } else if (prop.startsWith('s:')) {
        // Sections property
        const sectionsStr = prop.substring(2);
        spec.sections = this.parseSections(sectionsStr, errors, warnings);
      } else if (prop.startsWith('c:')) {
        // Colors property
        const colorsStr = prop.substring(2);
        this.parseColors(colorsStr, spec, errors, warnings);
      } else {
        warnings.push(`Unknown property: ${prop}`);
      }
    }
  }

  /**
   * Split properties respecting nested brackets
   */
  private splitProperties(str: string): string[] {
    const props: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === '[' || char === '{') {
        depth++;
        current += char;
      } else if (char === ']' || char === '}') {
        depth--;
        current += char;
      } else if (char === '|' && depth === 0) {
        if (current) {
          props.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      props.push(current);
    }

    return props;
  }

  /**
   * Parse sections array
   */
  private parseSections(
    sectionsStr: string,
    errors: string[],
    warnings: string[]
  ): Section[] {
    // Format: [h{ly:ctr}|f{ly:gr3}|cta]
    const match = sectionsStr.match(/^\[(.+)\]$/);
    if (!match) {
      errors.push('Invalid sections format');
      return [];
    }

    const innerStr = match[1];
    const sectionParts = this.splitSections(innerStr);
    const sections: Section[] = [];

    for (const part of sectionParts) {
      const section = this.parseSection(part, errors, warnings);
      if (section) {
        sections.push(section);
      }
    }

    return sections;
  }

  /**
   * Split sections respecting nested brackets
   */
  private splitSections(str: string): string[] {
    const sections: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === '{') {
        depth++;
        current += char;
      } else if (char === '}') {
        depth--;
        current += char;
      } else if (char === '|' && depth === 0) {
        if (current) {
          sections.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      sections.push(current);
    }

    return sections;
  }

  /**
   * Parse individual section
   */
  private parseSection(
    sectionStr: string,
    errors: string[],
    warnings: string[]
  ): Section | null {
    // Format: h{ly:ctr} or just h
    const match = sectionStr.match(/^(\w+)(?:\{(.+)\})?$/);
    if (!match) {
      errors.push(`Invalid section format: ${sectionStr}`);
      return null;
    }

    const [, componentCode, propsStr] = match;

    // Validate component type
    if (!TOONHelper.isValidComponent(componentCode)) {
      errors.push(`Invalid component: ${componentCode}`);
      return null;
    }

    const section: Section = {
      type: componentCode as ComponentType,
    };

    if (propsStr) {
      const props = this.parseProperties(propsStr, {} as TOONSpec, errors, warnings);

      // Parse section properties
      const sectionProps = propsStr.split('|');
      for (const prop of sectionProps) {
        if (prop.startsWith('ly:')) {
          section.layout = prop.substring(3);
        } else if (prop.startsWith('sz:')) {
          const size = prop.substring(3);
          if (['xs', 'sm', 'md', 'lg', 'xl'].includes(size)) {
            section.size = size as 'xs' | 'sm' | 'md' | 'lg' | 'xl';
          } else {
            warnings.push(`Invalid size: ${size}`);
          }
        }
      }
    }

    return section;
  }

  /**
   * Parse colors
   */
  private parseColors(
    colorsStr: string,
    spec: TOONSpec,
    errors: string[],
    warnings: string[]
  ): void {
    // Format: [bl,rd,gr] or [bl,#FF0000]
    const match = colorsStr.match(/^\[(.+)\]$/);
    if (!match) {
      errors.push('Invalid colors format');
      return;
    }

    const colorCodes = match[1].split(',');
    spec.colors = [];
    spec.customColors = [];

    for (const code of colorCodes) {
      const trimmed = code.trim();
      if (trimmed.startsWith('#')) {
        // Custom hex color
        spec.customColors.push(trimmed);
      } else if (TOONHelper.isValidColor(trimmed)) {
        // Dictionary color
        spec.colors.push(trimmed as ColorKey);
      } else {
        warnings.push(`Invalid color code: ${trimmed}`);
      }
    }
  }

  /**
   * Validate the spec
   */
  private validate(
    spec: TOONSpec,
    errors: string[],
    warnings: string[]
  ): void {
    // Check if sections is empty
    if (spec.sections.length === 0) {
      warnings.push('No sections defined');
    }

    // Check for duplicate sections
    const seen = new Set<string>();
    for (const section of spec.sections) {
      if (seen.has(section.type)) {
        warnings.push(`Duplicate section: ${section.type}`);
      }
      seen.add(section.type);
    }

    // Validate layouts for each component
    for (const section of spec.sections) {
      if (section.layout) {
        const validLayouts = this.getValidLayouts(section.type);
        if (validLayouts && !validLayouts.includes(section.layout)) {
          warnings.push(
            `Invalid layout '${section.layout}' for component '${section.type}'`
          );
        }
      }
    }
  }

  /**
   * Get valid layouts for a component type
   */
  private getValidLayouts(componentType: ComponentType): string[] | null {
    const layoutMap: Record<string, string[]> = {
      h: Object.keys(TOON_DICTIONARY.layouts.hero),
      f: Object.keys(TOON_DICTIONARY.layouts.features),
      g: Object.keys(TOON_DICTIONARY.layouts.gallery),
      pr: Object.keys(TOON_DICTIONARY.layouts.pricing),
    };

    return layoutMap[componentType] || null;
  }

  /**
   * Get a default spec
   */
  private getDefaultSpec(): TOONSpec {
    return {
      siteType: 'lp',
      sections: [{ type: 'h' }],
    };
  }

  /**
   * Convert spec back to TOON string
   */
  encode(spec: TOONSpec): string {
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
          const sectionProps: string[] = [];

          if (section.layout) {
            sectionProps.push(`ly:${section.layout}`);
          }
          if (section.size) {
            sectionProps.push(`sz:${section.size}`);
          }

          if (sectionProps.length > 0) {
            sectionStr += `{${sectionProps.join('|')}}`;
          }

          return sectionStr;
        })
        .join('|');
      props.push(`s:[${sectionsStr}]`);
    }

    // Add colors
    if (spec.colors && spec.colors.length > 0) {
      const allColors = [
        ...spec.colors,
        ...(spec.customColors || []),
      ];
      props.push(`c:[${allColors.join(',')}]`);
    }

    if (props.length > 0) {
      result += `{${props.join('|')}}`;
    }

    return result;
  }

  /**
   * Get human-readable description of spec
   */
  describe(spec: TOONSpec): string {
    const parts: string[] = [];

    // Site type
    const siteTypeName = TOONHelper.getSiteTypeName(spec.siteType);
    parts.push(siteTypeName);

    // Style
    if (spec.style) {
      const styleName = TOONHelper.getStyleName(spec.style);
      parts.push(`with ${styleName} style`);
    }

    // Sections
    if (spec.sections.length > 0) {
      const sectionNames = spec.sections
        .map((s) => TOONHelper.getComponentName(s.type))
        .join(', ');
      parts.push(`containing: ${sectionNames}`);
    }

    return parts.join(' ');
  }
}
