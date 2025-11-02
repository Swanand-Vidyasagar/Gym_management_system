"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface PaymentHistoryTableProps {
  user: any
}

export default function PaymentHistoryTable({ user }: PaymentHistoryTableProps) {
  const payments = [
    {
      id: 1,
      date: "2025-01-10",
      amount: 2499,
      method: "Card ending in 4242",
      status: "completed",
      membership: "Premium Plus",
      transactionId: "TXN-2025-001",
    },
    {
      id: 2,
      date: "2024-12-10",
      amount: 2499,
      method: "UPI - PhonePe",
      status: "completed",
      membership: "Premium Plus",
      transactionId: "TXN-2024-144",
    },
    {
      id: 3,
      date: "2024-11-10",
      amount: 2499,
      method: "Card ending in 5555",
      status: "completed",
      membership: "Premium Plus",
      transactionId: "TXN-2024-121",
    },
    {
      id: 4,
      date: "2024-10-10",
      amount: 2499,
      method: "UPI - Google Pay",
      status: "completed",
      membership: "Premium Plus",
      transactionId: "TXN-2024-098",
    },
    {
      id: 5,
      date: "2024-09-10",
      amount: 999,
      method: "Cash",
      status: "completed",
      membership: "Basic",
      transactionId: "TXN-2024-075",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/20 text-accent"
      case "pending":
        return "bg-yellow-500/20 text-yellow-600"
      case "failed":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="bg-card border-border p-6 overflow-hidden">
      <h3 className="text-lg font-bold text-foreground mb-6">Payment History</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Date</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Amount</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Plan</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Method</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment.id}
                className={`border-b border-border hover:bg-muted/50 transition ${
                  index === payments.length - 1 ? "border-0" : ""
                }`}
              >
                <td className="py-4 px-4 text-foreground text-sm font-medium">{formatDate(payment.date)}</td>
                <td className="py-4 px-4 text-foreground font-semibold">₹{payment.amount.toLocaleString('en-IN')}</td>
                <td className="py-4 px-4 text-foreground text-sm">{payment.membership}</td>
                <td className="py-4 px-4 text-muted-foreground text-sm">{payment.method}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-medium capitalize ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-muted text-xs bg-transparent"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-muted text-xs bg-transparent"
                    >
                      <Download size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold">{payments.length}</span> transactions
        </p>
        <Button variant="outline" className="border-border text-foreground hover:bg-muted text-xs bg-transparent">
          Load More
        </Button>
      </div>
    </Card>
  )
}
