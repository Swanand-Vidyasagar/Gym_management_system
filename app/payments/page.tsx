"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PaymentMethodsSection from "@/components/payments/payment-methods-section"
import PaymentHistoryTable from "@/components/payments/payment-history-table"
import AddPaymentModal from "@/components/payments/add-payment-modal"
import { useAuth } from "@/contexts/AuthContext"

export default function PaymentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Payment Management</h1>
            <p className="text-muted-foreground">Manage your payment methods and view transaction history</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Add Payment Method
          </Button>
        </div>

        {/* Payment Methods */}
        <PaymentMethodsSection />

        {/* Billing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Next Payment Due</p>
            <p className="text-3xl font-bold text-foreground mb-2">Jan 15, 2025</p>
            <p className="text-accent font-semibold">₹2,499</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Current Plan</p>
            <p className="text-3xl font-bold text-foreground mb-2">Premium Plus</p>
            <p className="text-muted-foreground">Monthly billing</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Paid (YTD)</p>
            <p className="text-3xl font-bold text-foreground mb-2">₹18,495</p>
            <p className="text-muted-foreground">18 transactions</p>
          </Card>
        </div>

        {/* Payment History */}
        <PaymentHistoryTable user={user} />

        {/* Invoice Section */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Download Invoices</h3>
          <p className="text-muted-foreground mb-6">Access your past invoices and payment receipts</p>
          <div className="space-y-3">
            {[
              { date: "January 2025", amount: "₹2,499" },
              { date: "December 2024", amount: "₹2,499" },
              { date: "November 2024", amount: "₹2,499" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition"
              >
                <div>
                  <p className="font-medium text-foreground">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showAddModal && <AddPaymentModal onClose={() => setShowAddModal(false)} />}
    </DashboardLayout>
  )
}
