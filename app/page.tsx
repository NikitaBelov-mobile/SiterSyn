import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/UserNav'
import { Zap, Sparkles, Rocket, Code2, Wand2, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen gradient-bg grid-pattern relative overflow-hidden">
      {/* Radial glow effect */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* Header */}
      <header className="relative glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              SiterSyn
            </Link>
            <nav className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="ghost" asChild className="hover:bg-white/5">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserNav />
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hover:bg-white/5">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="glow-hover bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0">
                    <Link href="/signup">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-glow-pulse" />
              <span className="text-muted-foreground">Powered by Claude Sonnet 4</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Создавайте сайты
              <br />
              <span className="gradient-text text-glow">
                за 5 минут
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              AI-генератор профессиональных сайтов. От текстового описания до готового React компонента с красивым дизайном.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="text-lg px-8 glow-hover bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0">
                <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2">
                  {user ? (
                    <>
                      <Rocket className="w-5 h-5" />
                      Go to Dashboard
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Начать бесплатно
                    </>
                  )}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 glass border-white/10 hover:bg-white/5">
                <Link href="/pricing" className="flex items-center gap-2">
                  Посмотреть тарифы
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">3GB</div>
                <div className="text-sm text-muted-foreground mt-1">Free credits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">5min</div>
                <div className="text-sm text-muted-foreground mt-1">Generation time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">67%</div>
                <div className="text-sm text-muted-foreground mt-1">Cost reduction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Почему <span className="gradient-text">SiterSyn</span>?
              </h2>
              <p className="text-muted-foreground text-lg">
                Современная платформа с уникальными технологиями оптимизации
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="glass-card glow-hover group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Мгновенно</h3>
                <p className="text-muted-foreground">
                  От промпта до готового сайта за 5 минут. Никаких ожиданий.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card glow-hover group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Claude Sonnet 4 с TOON-оптимизацией. Профессиональный код, красивый дизайн.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card glow-hover group">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Полный контроль</h3>
                <p className="text-muted-foreground">
                  Экспортируйте чистый React код. Владейте всем на 100%.
                </p>
              </div>
            </div>

            {/* Tech highlight */}
            <div className="mt-12 glass p-8 rounded-2xl border border-white/10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center animate-float">
                    <Rocket className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">TOON Encoding Technology</h3>
                  <p className="text-muted-foreground">
                    Уникальная система сжатия промптов, которая снижает стоимость генерации на 67% и ускоряет процесс на 40%. Больше генераций за те же деньги.
                  </p>
                </div>
                <div>
                  <Button variant="outline" asChild className="glass border-white/10">
                    <Link href="/pricing">
                      Узнать больше
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative glass border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-muted-foreground">
                Made with AI by SiterSyn
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
