import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/UserNav'
import { ArrowRight } from 'lucide-react'
import { CustomIcons } from '@/components/CustomIcons'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen gradient-bg grid-pattern relative overflow-hidden">
      {/* Animated radial glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Header */}
      <header className="relative glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-3xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center gap-3 group">
              <div className="w-10 h-10 relative">
                <CustomIcons.Sparkle className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="gradient-text text-2xl font-black tracking-tight">
                SiterSyn
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="ghost" asChild className="hover:bg-white/5 transition-all duration-300">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserNav />
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hover:bg-white/5 transition-all duration-300">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="glow-hover bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 border-0 font-semibold">
                    <Link href="/signup" className="flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
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
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 stagger-container">
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full text-sm border border-white/20">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-muted-foreground font-medium">Powered by Claude Sonnet 4</span>
              </div>
            </div>

            {/* Main heading with stagger animation */}
            <div className="text-center mb-12 stagger-container">
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tighter">
                <span className="block">Создавайте сайты</span>
                <span className="block gradient-text text-glow-strong inline-block">
                  за 5 минут
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                AI-генератор профессиональных сайтов. От текстового описания до готового React компонента с красивым дизайном.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center perspective-1000">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-10 py-7 glow-hover bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 border-0 font-bold text-white shadow-2xl"
                >
                  <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-3">
                    <CustomIcons.Wand className="w-6 h-6" />
                    {user ? 'Go to Dashboard' : 'Начать бесплатно'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-10 py-7 glass border-white/20 hover:bg-white/10 font-semibold backdrop-blur-xl transition-all duration-300"
                >
                  <Link href="/pricing" className="flex items-center gap-2">
                    Посмотреть тарифы
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats with stagger animation */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-24 stagger-container">
              <div className="text-center glass-card py-6 glow-hover">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">3</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Free Credits</div>
              </div>
              <div className="text-center glass-card py-6 glow-hover">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">5min</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Generation</div>
              </div>
              <div className="text-center glass-card py-6 glow-hover">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">67%</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Cost Cut</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                Почему <span className="gradient-text">SiterSyn</span>?
              </h2>
              <p className="text-muted-foreground/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                Современная платформа с уникальными технологиями оптимизации
              </p>
            </div>

            {/* Feature grid with stagger */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 stagger-container">
              {/* Feature 1 */}
              <div className="glass-card glow-hover group perspective-1000">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <CustomIcons.Lightning className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Мгновенно</h3>
                <p className="text-muted-foreground/80 leading-relaxed">
                  От промпта до готового сайта за 5 минут. Никаких ожиданий. Просто результат.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card glow-hover group perspective-1000">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <CustomIcons.Brain className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">AI-Powered</h3>
                <p className="text-muted-foreground/80 leading-relaxed">
                  Claude Sonnet 4 с TOON-оптимизацией. Профессиональный код, красивый дизайн.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card glow-hover group perspective-1000">
                <div className="w-16 h-16 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <CustomIcons.Code className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Полный контроль</h3>
                <p className="text-muted-foreground/80 leading-relaxed">
                  Экспортируйте чистый React код. Владейте всем на 100%. Никаких ограничений.
                </p>
              </div>
            </div>

            {/* Tech highlight */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative glass p-10 md:p-12 rounded-3xl border border-white/20">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-glow-pulse"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-float">
                        <CustomIcons.Rocket className="w-14 h-14 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">TOON Encoding Technology</h3>
                    <p className="text-muted-foreground/80 text-lg leading-relaxed">
                      Уникальная система сжатия промптов, которая снижает стоимость генерации на <span className="text-green-400 font-bold">67%</span> и ускоряет процесс на <span className="text-blue-400 font-bold">40%</span>. Больше генераций за те же деньги.
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" asChild className="glass border-white/20 hover:bg-white/10 font-semibold px-8 text-lg">
                      <Link href="/pricing">
                        Узнать больше
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative glass border-t border-white/10 py-12 backdrop-blur-3xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <CustomIcons.Sparkle className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-muted-foreground font-medium">
                Made with AI by <span className="text-foreground font-semibold">SiterSyn</span>
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
              <Link href="/pricing" className="hover:text-foreground transition-colors duration-200">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors duration-200">
                Dashboard
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-200">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
