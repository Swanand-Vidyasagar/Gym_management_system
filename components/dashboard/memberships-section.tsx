"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle, CheckCircle } from "lucide-react"

interface MembershipsSectionProps {
  user: any
}

export default function MembershipsSection({ user }: MembershipsSectionProps) {
  const memberships = [
    {
      id: 1,
      type: "Premium Plus",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      price: 2499,
      status: "active",
    },
    {
      id: 2,
      type: "Elite Pro",
      startDate: "2024-06-01",
      endDate: "2024-12-01",
      price: 4999,
      status: "expired",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Memberships</h3>

      <div className="space-y-4">
        {memberships.map((membership) => (
          <div key={membership.id} className="border border-border rounded-lg p-4 hover:border-accent/50 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground">{membership.type}</h4>
                <p className="text-sm text-muted-foreground">₹{membership.price.toLocaleString('en-IN')}/month</p>
              </div>
              {isExpired(membership.endDate) ? (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle size={16} />
                  Expired
                </div>
              ) : (
                <div className="flex items-center gap-2 text-accent text-sm">
                  <CheckCircle size={16} />
                  Active
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar size={16} />
              {formatDate(membership.startDate)} to {formatDate(membership.endDate)}
            </div>

            <div className="flex gap-2">
              {isExpired(membership.endDate) ? (
                <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-sm">Renew</Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted text-sm bg-transparent"
                >
                  Manage
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
        Browse All Memberships
      </Button>
    </Card>
  )
}
