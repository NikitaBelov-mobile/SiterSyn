import { TOONSpec } from '@/lib/ai/toon/dictionary'

/**
 * Template definition
 */
export interface Template {
  id: string
  name: string
  description: string
  spec: {
    siteType: string
    style?: string
    sections: Array<{
      type: string
      layout?: string
      size?: string
    }>
  }
  code: string
  variables: string[] // Placeholders that can be customized
  tags: string[]
}

/**
 * Template Library
 * Pre-built templates for common site patterns
 */
export const templates: Template[] = [
  {
    id: 'minimal-landing-1',
    name: 'Minimal Landing Page',
    description: 'Clean, centered hero with features grid',
    spec: {
      siteType: 'lp',
      style: 'min',
      sections: [
        { type: 'h', layout: 'ctr' },
        { type: 'f', layout: 'gr3' },
        { type: 'ct', layout: 'ctr' },
      ],
    },
    code: `export default function MinimalLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            {{title}}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {{subtitle}}
          </p>
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            {{cta_text}}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Fast</h3>
              <p className="text-gray-600">Lightning-fast performance and load times</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Beautiful</h3>
              <p className="text-gray-600">Clean, modern design that looks great</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure</h3>
              <p className="text-gray-600">Built with security best practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}`,
    variables: ['title', 'subtitle', 'cta_text'],
    tags: ['landing', 'minimal', 'clean', 'simple'],
  },
  {
    id: 'corporate-landing-1',
    name: 'Corporate Landing Page',
    description: 'Professional split hero with features and pricing',
    spec: {
      siteType: 'lp',
      style: 'cor',
      sections: [
        { type: 'h', layout: 'spl' },
        { type: 'f', layout: 'gr3' },
        { type: 'pr', layout: 'gr3' },
        { type: 'ct', layout: 'ctr' },
      ],
    },
    code: `export default function CorporateLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Split */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                {{title}}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {{subtitle}}
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                  Get Started
                </button>
                <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400">
                  Learn More
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-96 flex items-center justify-center text-white text-6xl">
              📊
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics</h3>
              <p className="text-gray-600">Comprehensive analytics and reporting tools</p>
            </div>
            <div className="p-8 bg-white rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Integration</h3>
              <p className="text-gray-600">Seamless integration with your tools</p>
            </div>
            <div className="p-8 bg-white rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">Work together with your team efficiently</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border-2 border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">$29<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Feature 1</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Feature 2</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Feature 3</li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50">
                Choose Plan
              </button>
            </div>
            <div className="p-8 border-2 border-blue-600 rounded-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$79<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> All Starter features</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Feature 4</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Feature 5</li>
              </ul>
              <button className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Choose Plan
              </button>
            </div>
            <div className="p-8 border-2 border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> All Pro features</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Custom solutions</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Dedicated support</li>
              </ul>
              <button className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}`,
    variables: ['title', 'subtitle'],
    tags: ['landing', 'corporate', 'professional', 'business', 'pricing'],
  },
  {
    id: 'portfolio-creative-1',
    name: 'Creative Portfolio',
    description: 'Modern portfolio with project gallery',
    spec: {
      siteType: 'pf',
      style: 'cre',
      sections: [
        { type: 'h', layout: 'ctr' },
        { type: 'g', layout: 'gr3' },
        { type: 'ct', layout: 'ctr' },
      ],
    },
    code: `export default function CreativePortfolio() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {{name}}
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            {{role}}
          </p>
          <p className="text-lg text-gray-400">
            {{bio}}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative aspect-square bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Project {i}</h3>
                    <p className="text-gray-300">View Details</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-gray-400 mb-8">
            Have a project in mind? Let's create something amazing.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  )
}`,
    variables: ['name', 'role', 'bio'],
    tags: ['portfolio', 'creative', 'modern', 'gallery'],
  },
]

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}

/**
 * Search templates by tags
 */
export function searchTemplatesByTags(tags: string[]): Template[] {
  return templates.filter((template) =>
    tags.some((tag) => template.tags.includes(tag.toLowerCase()))
  )
}

/**
 * Get all templates
 */
export function getAllTemplates(): Template[] {
  return templates
}
