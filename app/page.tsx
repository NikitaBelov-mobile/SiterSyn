import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/UserNav'
import { ArrowRight, Check } from 'lucide-react'
import { CustomIcons } from '@/components/CustomIcons'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="section-content">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8">
                <CustomIcons.Sparkle className="w-full h-full transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                SiterSyn
              </span>
            </Link>
            <nav className="flex items-center gap-3">
              {user ? (
                <>
                  <Button variant="ghost" asChild className="transition-smooth">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserNav />
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="transition-smooth">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="btn-primary">
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
        <section className="section-padding">
          <div className="section-content">
            <div className="container-narrow text-center">
              {/* Badge */}
              <div className="mb-8 fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Powered by Claude Sonnet 4
                </div>
              </div>

              {/* Main heading */}
              <div className="mb-6 fade-in fade-in-delay-1">
                <h1 className="heading-xl mb-6 text-balance">
                  Создавайте сайты{' '}
                  <span className="accent-text">за 5 минут</span>
                </h1>
                <p className="body-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                  AI-генератор профессиональных сайтов. От текстового описания до готового React компонента с красивым дизайном.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-in fade-in-delay-2">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary text-base"
                >
                  <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2">
                    <CustomIcons.Wand className="w-5 h-5" />
                    {user ? 'Go to Dashboard' : 'Начать бесплатно'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="btn-secondary text-base"
                >
                  <Link href="/pricing" className="flex items-center gap-2">
                    Посмотреть тарифы
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto fade-in fade-in-delay-3">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">3</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Free Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">5min</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Generation</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">67%</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Cost Cut</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-muted/30">
          <div className="section-content">
            <div className="container-wide">
              {/* Section header */}
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">
                  Почему <span className="accent-text">SiterSyn</span>?
                </h2>
                <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
                  Современная платформа с уникальными технологиями оптимизации
                </p>
              </div>

              {/* Feature grid */}
              <div className="feature-grid">
                {/* Feature 1 */}
                <div className="card-elevated group">
                  <div className="w-12 h-12 mb-6 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary/20">
                    <CustomIcons.Lightning className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Мгновенно</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    От промпта до готового сайта за 5 минут. Никаких ожиданий. Просто результат.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="card-elevated group">
                  <div className="w-12 h-12 mb-6 bg-secondary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-secondary/20">
                    <CustomIcons.Brain className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">AI-Powered</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Claude Sonnet 4 с TOON-оптимизацией. Профессиональный код, красивый дизайн.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="card-elevated group">
                  <div className="w-12 h-12 mb-6 bg-primary/10 rounded-lg flex items-center justify-center transition-smooth group-hover:bg-primary/20">
                    <CustomIcons.Code className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Полный контроль</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Экспортируйте чистый React код. Владейте всем на 100%. Никаких ограничений.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOON Technology Highlight */}
        <section className="section-padding">
          <div className="section-content">
            <div className="container-wide">
              <div className="card-elevated">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <CustomIcons.Rocket className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="heading-md mb-3">TOON Encoding Technology</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Уникальная система сжатия промптов, которая снижает стоимость генерации на{' '}
                      <span className="font-semibold text-foreground">67%</span> и ускоряет процесс на{' '}
                      <span className="font-semibold text-foreground">40%</span>. Больше генераций за те же деньги.
                    </p>
                  </div>
                  <div>
                    <Button asChild className="btn-secondary">
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
        <section className="section-padding bg-muted/30">
          <div className="section-content">
            <div className="container-narrow">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">Как это работает</h2>
                <p className="body-lg text-muted-foreground">
                  Три простых шага до вашего готового сайта
                </p>
              </div>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Опишите ваш сайт</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Просто напишите, что вы хотите создать. AI поймет ваши требования и создаст профессиональный дизайн.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Получите готовый код</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      За 5 минут AI сгенерирует чистый React компонент с современным дизайном и адаптивной версткой.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Экспортируйте и используйте</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Скачайте код и интегрируйте в ваш проект. Полный контроль, никаких зависимостей от платформы.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="section-content">
            <div className="container-narrow text-center">
              <div className="card-elevated">
                <h2 className="heading-lg mb-4">Готовы начать?</h2>
                <p className="body-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Получите 3 бесплатных кредита и создайте ваш первый сайт прямо сейчас
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="btn-primary text-base"
                  >
                    <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2">
                      <CustomIcons.Wand className="w-5 h-5" />
                      {user ? 'Go to Dashboard' : 'Начать бесплатно'}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="btn-secondary text-base"
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
      <footer className="border-t border-border py-12">
        <div className="section-content">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <CustomIcons.Sparkle className="w-5 h-5" />
              <span className="text-sm text-muted-foreground">
                Made with AI by <span className="font-semibold text-foreground">SiterSyn</span>
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-foreground transition-smooth">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-smooth">
                Dashboard
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-smooth">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
