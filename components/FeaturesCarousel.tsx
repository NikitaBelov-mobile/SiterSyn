'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Zap, Sparkles, Shield, Code2, Rocket, Target, Award, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Мгновенно',
    description: 'От промпта до готового сайта за 5 минут. Никаких ожиданий. Просто результат.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop',
    alt: 'Team working together efficiently',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Claude Sonnet 4 с TOON-оптимизацией. Профессиональный код, красивый дизайн.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2574&auto=format&fit=crop',
    alt: 'Developer coding with AI assistance',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: Shield,
    title: 'Полный контроль',
    description: 'Экспортируйте чистый React код. Владейте всем на 100%. Никаких ограничений.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop',
    alt: 'Professional team reviewing code',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Code2,
    title: 'Чистый код',
    description: 'Современный React, TypeScript и Tailwind CSS. Никаких устаревших технологий.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2669&auto=format&fit=crop',
    alt: 'Clean code on monitor',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Rocket,
    title: 'Быстрый старт',
    description: 'Регистрация за 30 секунд. 3 бесплатных кредита сразу. Без кредитной карты.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop',
    alt: 'Rocket launch representing fast start',
    color: 'from-red-500 to-rose-600'
  },
  {
    icon: Target,
    title: 'Точность AI',
    description: 'Понимает сложные требования. Генерирует именно то, что вы задумали.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2515&auto=format&fit=crop',
    alt: 'Target precision analytics',
    color: 'from-indigo-500 to-violet-600'
  },
  {
    icon: Award,
    title: 'Премиум качество',
    description: 'Профессиональный дизайн, адаптивная верстка, оптимизация производительности.',
    image: 'https://images.unsplash.com/photo-1534951009808-766178b47a4f?q=80&w=2670&auto=format&fit=crop',
    alt: 'Premium quality award',
    color: 'from-yellow-500 to-amber-600'
  },
  {
    icon: Globe,
    title: 'Глобальная доступность',
    description: 'Работает везде. Поддержка мультиязычности. Международные стандарты.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop',
    alt: 'Global network connectivity',
    color: 'from-teal-500 to-cyan-600'
  }
]

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, features.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <div
      className="relative w-full overflow-hidden px-4 md:px-6 lg:px-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div className="relative max-w-[1600px] mx-auto">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-card/95 border-2 border-primary/20 shadow-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 flex items-center justify-center hover:scale-110 backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-card/95 border-2 border-primary/20 shadow-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 flex items-center justify-center hover:scale-110 backdrop-blur-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        {/* Slides Track */}
        <div className="overflow-hidden px-12 md:px-16">
          <div
            className="flex transition-transform duration-700 ease-out gap-4 md:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              const gapSize = itemsPerView === 1 ? 1 : 1.5 // 1rem for mobile, 1.5rem for desktop
              return (
                <div
                  key={index}
                  className="flex-shrink-0 group"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * gapSize}rem / ${itemsPerView})` }}
                >
                  <div className="cinematic-card h-full hover:scale-[1.02] transition-all duration-500">
                    {/* Image with gradient overlay */}
                    <div className="relative image-container aspect-video mb-6 overflow-hidden">
                      <Image
                        src={feature.image}
                        alt={feature.alt}
                        fill
                        className="img-cinematic group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                      <div className="image-overlay" />

                      {/* Floating Icon */}
                      <div className="absolute top-4 right-4 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-primary/20">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {isAutoPlaying ? '⏸ Pause' : '▶ Play'} auto-scroll
        </button>
      </div>
    </div>
  )
}
