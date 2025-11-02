"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PaymentHistorySectionProps {
  user: any
}

export default function PaymentHistorySection({ user }: PaymentHistorySectionProps) {
  const payments = [
    {
      id: 1,
      date: "2025-01-10",
      amount: 2499,
      method: "Card",
      status: "completed",
      membership: "Premium Plus",
    },
    {
      id: 2,
      date: "2024-12-10",
      amount: 2499,
      method: "UPI",
      status: "completed",
      membership: "Premium Plus",
    },
    {
      id: 3,
      date: "2024-11-10",
      amount: 2499,
      method: "Card",
      status: "completed",
      membership: "Premium Plus",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Payment History</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Amount</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Method</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="py-3 text-foreground">{formatDate(payment.date)}</td>
                <td className="py-3 text-foreground font-semibold">₹{payment.amount.toLocaleString('en-IN')}</td>
                <td className="py-3 text-muted-foreground">{payment.method}</td>
                <td className="py-3">
                  <span className="inline-block px-2 py-1 rounded bg-accent/20 text-accent text-xs font-medium">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" className="w-full mt-4 border-border text-foreground hover:bg-muted bg-transparent">
        <Download size={16} className="mr-2" />
        View All Payments
      </Button>
    </Card>
  )
}
