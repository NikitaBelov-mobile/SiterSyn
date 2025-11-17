'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Coins } from 'lucide-react'

interface CreditsData {
  credits: number
  tier: string
}

export function CreditsDisplay() {
  const [creditsData, setCreditsData] = useState<CreditsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits')
      if (response.ok) {
        const data = await response.json()
        setCreditsData(data)
      }
    } catch (error) {
      console.error('Error fetching credits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Coins className="h-3.5 w-3.5" />
        <span>Loading...</span>
      </Badge>
    )
  }

  if (!creditsData) {
    return null
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      case 'starter':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'pro':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      case 'business':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getCreditsColor = (credits: number) => {
    if (credits === 0) return 'text-red-600'
    if (credits <= 2) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`gap-1.5 ${getTierColor(creditsData.tier)}`}>
        <span className="capitalize">{creditsData.tier}</span>
      </Badge>
      <Badge variant="outline" className="gap-1.5">
        <Coins className="h-3.5 w-3.5" />
        <span className={getCreditsColor(creditsData.credits)}>
          {creditsData.credits} {creditsData.credits === 1 ? 'credit' : 'credits'}
        </span>
      </Badge>
    </div>
  )
}
