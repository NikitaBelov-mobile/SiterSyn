import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/UserNav'
import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import FeaturesCarousel from '@/components/FeaturesCarousel'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-content">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              SiterSyn
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
                  <Button asChild className="btn-cinematic">
                    <Link href="/signup">
                      Get Started
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
        <section className="hero-section">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
              alt="Team collaborating on a project"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
          </div>

          <div className="section-content relative z-10">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="mb-8 fade-in">
                <div className="badge">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Powered by Claude Sonnet 4</span>
                </div>
              </div>

              {/* Main heading */}
              <div className="mb-8 fade-in-up fade-in-delay-1">
                <h1 className="heading-xl mb-6">
                  Создавайте сайты{' '}
                  <span className="accent-text">за 5 минут</span>
                </h1>
                <p className="body-lg text-muted-foreground max-w-2xl">
                  AI-генератор профессиональных сайтов. От текстового описания до готового React компонента с красивым дизайном.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16 fade-in-up fade-in-delay-2">
                <Button
                  asChild
                  size="lg"
                  className="btn-cinematic text-base"
                >
                  <Link href={user ? '/dashboard' : '/signup'}>
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl fade-in-up fade-in-delay-3">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-1 text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Free Credits</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-1 text-primary">5min</div>
                  <div className="text-sm text-muted-foreground">Generation</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-1 text-primary">67%</div>
                  <div className="text-sm text-muted-foreground">Cost Cut</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-muted/20 group">
          <div className="section-content">
            {/* Section header */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="badge mb-6 mx-auto">
                <span>Наши преимущества</span>
              </div>
              <h2 className="heading-lg mb-4">
                Почему <span className="accent-text">SiterSyn</span>?
              </h2>
              <p className="body-lg text-muted-foreground">
                Современная платформа с уникальными технологиями оптимизации
              </p>
            </div>

            {/* Features Carousel */}
            <FeaturesCarousel />
          </div>
        </section>

        {/* TOON Technology Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
              alt="Technology background"
              fill
              className="object-cover"
            />
          </div>

          <div className="section-content relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="cinematic-card">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="badge mb-6">
                      <span>Proprietary Technology</span>
                    </div>
                    <h3 className="heading-md mb-4">
                      <span className="accent-text">TOON</span> Encoding Technology
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      Уникальная система сжатия промптов, которая снижает стоимость генерации на{' '}
                      <span className="accent-text">67%</span> и ускоряет процесс на{' '}
                      <span className="accent-text">40%</span>.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Больше генераций за те же деньги</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Быстрее получайте результаты</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">Меньше токенов — больше возможностей</span>
                      </li>
                    </ul>
                  </div>
                  <div className="image-container aspect-square">
                    <Image
                      src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=2448&auto=format&fit=crop"
                      alt="Advanced technology visualization"
                      fill
                      className="img-cinematic"
                    />
                    <div className="image-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-padding bg-muted/20">
          <div className="section-content">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">Как это работает</h2>
                <p className="body-lg text-muted-foreground">
                  Три простых шага до вашего готового сайта
                </p>
              </div>

              <div className="space-y-12">
                {/* Step 1 */}
                <div className="cinematic-card fade-in-up fade-in-delay-1">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                      <div className="badge mb-4">
                        <span>Шаг 1</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Опишите ваш сайт</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Просто напишите, что вы хотите создать. AI поймет ваши требования и создаст профессиональный дизайн.
                      </p>
                    </div>
                    <div className="order-1 md:order-2 image-container aspect-video">
                      <Image
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"
                        alt="Team brainstorming ideas"
                        fill
                        className="img-cinematic"
                      />
                      <div className="image-overlay" />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="cinematic-card fade-in-up fade-in-delay-2">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="image-container aspect-video">
                      <Image
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop"
                        alt="Developer coding"
                        fill
                        className="img-cinematic"
                      />
                      <div className="image-overlay" />
                    </div>
                    <div>
                      <div className="badge mb-4">
                        <span>Шаг 2</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Получите готовый код</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        За 5 минут AI сгенерирует чистый React компонент с современным дизайном и адаптивной версткой.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="cinematic-card fade-in-up fade-in-delay-3">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                      <div className="badge mb-4">
                        <span>Шаг 3</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Экспортируйте и используйте</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Скачайте код и интегрируйте в ваш проект. Полный контроль, никаких зависимостей от платформы.
                      </p>
                    </div>
                    <div className="order-1 md:order-2 image-container aspect-video">
                      <Image
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop"
                        alt="Professional presenting results"
                        fill
                        className="img-cinematic"
                      />
                      <div className="image-overlay" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2574&auto=format&fit=crop"
              alt="Team celebrating success"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/80" />
          </div>

          <div className="section-content relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-4">Готовы начать?</h2>
              <p className="body-lg text-muted-foreground mb-10">
                Получите 3 бесплатных кредита и создайте ваш первый сайт прямо сейчас
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-cinematic text-base px-10"
                >
                  <Link href={user ? '/dashboard' : '/signup'}>
                    {user ? 'Go to Dashboard' : 'Начать бесплатно'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="btn-secondary text-base px-10"
                >
                  <Link href="/pricing">
                    Посмотреть тарифы
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="section-content">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-muted-foreground">
              Made with AI by <span className="font-semibold text-foreground">SiterSyn</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
