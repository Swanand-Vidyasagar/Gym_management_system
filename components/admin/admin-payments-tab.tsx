"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Check, Search } from "lucide-react"

export default function AdminPaymentsTab() {
  const [searchTerm, setSearchTerm] = useState("")

  const payments = [
    {
      id: 1,
      user: "John Doe",
      amount: 79.99,
      date: "2025-01-10",
      status: "completed",
      method: "Credit Card",
    },
    {
      id: 2,
      user: "Jane Smith",
      amount: 29.99,
      date: "2025-01-09",
      status: "completed",
      method: "Debit Card",
    },
    {
      id: 3,
      user: "Robert Johnson",
      amount: 79.99,
      date: "2025-01-08",
      status: "pending",
      method: "Bank Transfer",
    },
    {
      id: 4,
      user: "Emily Davis",
      amount: 149.99,
      date: "2025-01-07",
      status: "failed",
      method: "Credit Card",
    },
  ]

  const filteredPayments = payments.filter((p) => p.user.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check size={16} className="text-accent" />
      case "failed":
        return <AlertCircle size={16} className="text-destructive" />
      default:
        return <AlertCircle size={16} className="text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/20 text-accent"
      case "failed":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-yellow-500/20 text-yellow-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground pl-10"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">User</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Amount</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Date</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Method</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="py-4 px-4 text-foreground font-medium">{payment.user}</td>
                <td className="py-4 px-4 text-foreground font-semibold">${payment.amount.toFixed(2)}</td>
                <td className="py-4 px-4 text-muted-foreground text-sm">{payment.date}</td>
                <td className="py-4 px-4 text-muted-foreground text-sm">{payment.method}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(payment.status)}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted text-xs bg-transparent"
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
