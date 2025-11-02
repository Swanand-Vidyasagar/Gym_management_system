"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2, TrendingUp } from "lucide-react"

export default function AdminMembershipsTab() {
  const memberships = [
    { id: 1, name: "Basic", price: 999, members: 145, revenue: "₹1,44,855/mo", status: "active" },
    { id: 2, name: "Premium Plus", price: 2499, members: 542, revenue: "₹13,54,458/mo", status: "active" },
    { id: 3, name: "Elite Pro", price: 4999, members: 89, revenue: "₹4,44,911/mo", status: "active" },
    { id: 4, name: "Annual Unlimited", price: 8999, members: 34, revenue: "₹3,05,966/mo", status: "active" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memberships.map((membership) => (
          <Card key={membership.id} className="bg-muted/50 border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-foreground">{membership.name}</h4>
                <p className="text-2xl font-bold text-accent mt-1">₹{membership.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border text-foreground hover:bg-card bg-transparent"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Members</span>
                <span className="font-semibold text-foreground">{membership.members}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="font-semibold text-foreground">{membership.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                  {membership.status}
                </span>
              </div>
            </div>

            <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
              <TrendingUp size={14} className="mr-2" />
              View Analytics
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
