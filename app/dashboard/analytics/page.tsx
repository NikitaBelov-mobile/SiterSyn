// @ts-nocheck - Temporary fix for Supabase types issue
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, TrendingUp, Users, Zap, DollarSign, Activity } from 'lucide-react'

interface AnalyticsData {
  totalGenerations: number
  totalUsers: number
  cacheHitRate: number
  averageCost: number
  totalRevenue: number
  activeSubscriptions: number
  generationsByMethod: {
    template: number
    hybrid: number
    ai: number
  }
  recentActivity: {
    date: string
    generations: number
  }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Failed to load analytics</p>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Generations',
      value: data.totalGenerations.toLocaleString(),
      icon: Zap,
      description: 'All-time site generations',
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      description: 'Registered users',
      color: 'text-green-600',
    },
    {
      title: 'Cache Hit Rate',
      value: `${(data.cacheHitRate * 100).toFixed(1)}%`,
      icon: Activity,
      description: 'Cost savings from cache',
      color: 'text-purple-600',
    },
    {
      title: 'Average Cost',
      value: `$${data.averageCost.toFixed(4)}`,
      icon: DollarSign,
      description: 'Per generation',
      color: 'text-orange-600',
    },
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: 'All-time revenue',
      color: 'text-emerald-600',
    },
    {
      title: 'Active Subscriptions',
      value: data.activeSubscriptions.toLocaleString(),
      icon: BarChart,
      description: 'Paying subscribers',
      color: 'text-pink-600',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Platform metrics and performance insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Generation Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generations by Method</CardTitle>
            <CardDescription>Distribution of generation strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Template</span>
                  <span className="text-sm text-muted-foreground">
                    {data.generationsByMethod.template}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (data.generationsByMethod.template / data.totalGenerations) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Hybrid</span>
                  <span className="text-sm text-muted-foreground">
                    {data.generationsByMethod.hybrid}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (data.generationsByMethod.hybrid / data.totalGenerations) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Full AI</span>
                  <span className="text-sm text-muted-foreground">
                    {data.generationsByMethod.ai}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(data.generationsByMethod.ai / data.totalGenerations) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Efficiency</CardTitle>
            <CardDescription>How optimization strategies reduce costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Template (FREE)</span>
                <span className="text-sm font-bold text-green-600">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hybrid (~70% savings)</span>
                <span className="text-sm font-bold text-blue-600">$0.02</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Full AI</span>
                <span className="text-sm font-bold text-purple-600">$0.08</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Cost</span>
                  <span className="text-lg font-bold">${data.averageCost.toFixed(4)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Saved ${((0.08 - data.averageCost) * data.totalGenerations).toFixed(2)} through
                  optimization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
