"use client"

import { Card } from "@/components/ui/card"
import { Calendar, DollarSign, Zap, TrendingUp } from "lucide-react"

interface QuickStatsSectionProps {
  user: any
}

export default function QuickStatsSection({ user }: QuickStatsSectionProps) {
  const stats = [
    {
      icon: Calendar,
      label: "Active Memberships",
      value: "1",
      color: "text-accent",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: "₹18,495",
      color: "text-accent",
    },
    {
      icon: Zap,
      label: "Classes Attended",
      value: "24",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      label: "Progress",
      value: "+12%",
      color: "text-accent",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <Icon size={32} className={`${stat.color} opacity-20`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
