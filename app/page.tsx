import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/UserNav'
import { ArrowRight, Sparkles, Zap, Check } from 'lucide-react'
import { CustomIcons } from '@/components/CustomIcons'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Animated mesh gradient */}
      <div className="mesh-gradient fixed inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="section-content">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 text-purple-400">
                  <CustomIcons.Sparkle className="w-full h-full transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  SiterSyn
                </span>
              </Link>
              <nav className="flex items-center gap-3">
                {user ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <UserNav />
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild className="btn-modern">
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
        <main>
          <section className="section-padding relative overflow-hidden">
            {/* Floating orbs */}
            <div className="glow-orb w-96 h-96 bg-purple-500 top-20 -left-20 float-slow" />
            <div className="glow-orb w-80 h-80 bg-blue-500 bottom-20 -right-20 float-medium" />

            <div className="section-content relative">
              <div className="max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="mb-8 fade-in">
                  <div className="badge-pulse inline-flex">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">Powered by Claude Sonnet 4</span>
                  </div>
                </div>

                {/* Main heading */}
                <div className="mb-8 fade-in-up fade-in-delay-1">
                  <h1 className="heading-xl mb-6">
                    Создавайте сайты{' '}
                    <span className="gradient-text">за 5 минут</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    AI-генератор профессиональных сайтов. От текстового описания до готового React компонента с красивым дизайном.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 fade-in-up fade-in-delay-2">
                  <Button
                    asChild
                    size="lg"
                    className="btn-modern text-base px-10 py-6 text-lg shimmer"
                  >
                    <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {user ? 'Go to Dashboard' : 'Начать бесплатно'}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="px-10 py-6 text-lg border-2 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <Link href="/pricing" className="flex items-center gap-2">
                      Посмотреть тарифы
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto fade-in-up fade-in-delay-3">
                  <div className="glass-card text-center">
                    <div className="text-5xl md:text-6xl font-bold mb-2 gradient-text">3</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Free Credits</div>
                  </div>
                  <div className="glass-card text-center">
                    <div className="text-5xl md:text-6xl font-bold mb-2 gradient-text">5min</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Generation</div>
                  </div>
                  <div className="glass-card text-center">
                    <div className="text-5xl md:text-6xl font-bold mb-2 gradient-text">67%</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Cost Cut</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="section-padding relative">
            <div className="section-content">
              {/* Section header */}
              <div className="text-center mb-16 max-w-3xl mx-auto fade-in">
                <h2 className="heading-lg mb-6">
                  Почему <span className="gradient-text">SiterSyn</span>?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Современная платформа с уникальными технологиями оптимизации
                </p>
              </div>

              {/* Feature grid */}
              <div className="bento-grid max-w-6xl mx-auto">
                {/* Feature 1 */}
                <div className="feature-card fade-in-up fade-in-delay-1">
                  <div className="w-14 h-14 mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <CustomIcons.Lightning className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Мгновенно</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    От промпта до готового сайта за 5 минут. Никаких ожиданий. Просто результат.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="feature-card fade-in-up fade-in-delay-2">
                  <div className="w-14 h-14 mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <CustomIcons.Brain className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">AI-Powered</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Claude Sonnet 4 с TOON-оптимизацией. Профессиональный код, красивый дизайн.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="feature-card fade-in-up fade-in-delay-3">
                  <div className="w-14 h-14 mb-6 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <CustomIcons.Code className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Полный контроль</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Экспортируйте чистый React код. Владейте всем на 100%. Никаких ограничений.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TOON Technology Highlight */}
          <section className="section-padding relative">
            <div className="section-content">
              <div className="max-w-6xl mx-auto">
                <div className="glass-card shimmer">
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center">
                        <CustomIcons.Rocket className="w-14 h-14 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">TOON</span> Encoding Technology
                      </h3>
                      <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                        Уникальная система сжатия промптов, которая снижает стоимость генерации на{' '}
                        <span className="font-bold text-purple-400">67%</span> и ускоряет процесс на{' '}
                        <span className="font-bold text-blue-400">40%</span>. Больше генераций за те же деньги.
                      </p>
                    </div>
                    <div>
                      <Button asChild className="btn-modern">
                        <Link href="/pricing">
                          Узнать больше
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="section-padding relative">
            <div className="section-content">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 fade-in">
                  <h2 className="heading-lg mb-4">Как это работает</h2>
                  <p className="text-xl text-muted-foreground">
                    Три простых шага до вашего готового сайта
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-6 fade-in-up fade-in-delay-1">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-500/30">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">Опишите ваш сайт</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        Просто напишите, что вы хотите создать. AI поймет ваши требования и создаст профессиональный дизайн.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6 fade-in-up fade-in-delay-2">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/30">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">Получите готовый код</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        За 5 минут AI сгенерирует чистый React компонент с современным дизайном и адаптивной версткой.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6 fade-in-up fade-in-delay-3">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-cyan-500/30">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">Экспортируйте и используйте</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        Скачайте код и интегрируйте в ваш проект. Полный контроль, никаких зависимостей от платформы.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding relative">
            <div className="section-content">
              <div className="max-w-4xl mx-auto text-center">
                <div className="glass-card shimmer">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                  <h2 className="heading-lg mb-4">Готовы начать?</h2>
                  <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Получите 3 бесплатных кредита и создайте ваш первый сайт прямо сейчас
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="btn-modern text-base px-10 py-6"
                    >
                      <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {user ? 'Go to Dashboard' : 'Начать бесплатно'}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="px-10 py-6 text-base border-2 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <Link href="/pricing">
                        Посмотреть тарифы
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-12 bg-background/30 backdrop-blur-sm">
          <div className="section-content">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <CustomIcons.Sparkle className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-muted-foreground">
                  Made with AI by <span className="font-semibold text-foreground">SiterSyn</span>
                </span>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <Link href="/pricing" className="hover:text-purple-400 transition-colors">
                  Pricing
                </Link>
                <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
