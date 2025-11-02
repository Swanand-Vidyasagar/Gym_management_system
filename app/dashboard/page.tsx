"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProfileCard from "@/components/dashboard/profile-card"
import MembershipsSection from "@/components/dashboard/memberships-section"
import PaymentHistorySection from "@/components/dashboard/payment-history-section"
import QuickStatsSection from "@/components/dashboard/quick-stats-section"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

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
        {/* Quick Stats */}
        <QuickStatsSection user={user} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <ProfileCard user={user} />

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Memberships */}
            <MembershipsSection user={user} />

            {/* Payment History */}
            <PaymentHistorySection user={user} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
