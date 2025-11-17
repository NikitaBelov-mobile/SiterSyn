export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SiterSyn
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Мгновенная генерация профессиональных сайтов с помощью AI
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Начать бесплатно
          </button>
          <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Узнать больше
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">⚡ Быстро</h3>
            <p className="text-gray-600">От промпта до сайта за 5 минут</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">🤖 AI-powered</h3>
            <p className="text-gray-600">Использует Claude Sonnet 4</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">💰 Доступно</h3>
            <p className="text-gray-600">От $15/месяц</p>
          </div>
        </div>
      </div>
    </main>
  )
}
