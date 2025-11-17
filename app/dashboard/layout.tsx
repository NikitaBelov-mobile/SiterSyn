import { UserNav } from '@/components/UserNav'
import { CreditsDisplay } from '@/components/CreditsDisplay'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">SiterSyn</h1>
            </Link>
            <div className="flex items-center gap-4">
              <CreditsDisplay />
              <UserNav />
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
