"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUsersTab from "@/components/admin/admin-users-tab"
import AdminMembershipsTab from "@/components/admin/admin-memberships-tab"
import AdminPaymentsTab from "@/components/admin/admin-payments-tab"
import AdminReportsTab from "@/components/admin/admin-reports-tab"
import { Users, CreditCard, DollarSign, BarChart3, Activity } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
      return
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, authLoading, user, router])

  if (authLoading || !user || user.role !== "admin") {
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
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all gym operations and user data</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-2xl font-bold text-foreground mt-1">1,247</p>
                <p className="text-xs text-accent mt-1">+2.5% this month</p>
              </div>
              <Users size={32} className="text-accent opacity-20" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Members</p>
                <p className="text-2xl font-bold text-foreground mt-1">856</p>
                <p className="text-xs text-accent mt-1">68.6% membership rate</p>
              </div>
              <Activity size={32} className="text-accent opacity-20" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-1">₹5,82,000</p>
                <p className="text-xs text-accent mt-1">+12.3% vs last month</p>
              </div>
              <DollarSign size={32} className="text-accent opacity-20" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Payments</p>
                <p className="text-2xl font-bold text-foreground mt-1">34</p>
                <p className="text-xs text-destructive mt-1">Action needed</p>
              </div>
              <CreditCard size={32} className="text-accent opacity-20" />
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg. Member Rating</p>
                <p className="text-2xl font-bold text-foreground mt-1">4.7★</p>
                <p className="text-xs text-accent mt-1">Based on feedback</p>
              </div>
              <BarChart3 size={32} className="text-accent opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="bg-card border-border">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full bg-muted rounded-none border-b border-border">
              <TabsTrigger value="users" className="rounded-none flex-1">
                <Users size={18} className="mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="memberships" className="rounded-none flex-1">
                <CreditCard size={18} className="mr-2" />
                Memberships
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-none flex-1">
                <DollarSign size={18} className="mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="reports" className="rounded-none flex-1">
                <BarChart3 size={18} className="mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="users" className="m-0">
                <AdminUsersTab />
              </TabsContent>
              <TabsContent value="memberships" className="m-0">
                <AdminMembershipsTab />
              </TabsContent>
              <TabsContent value="payments" className="m-0">
                <AdminPaymentsTab />
              </TabsContent>
              <TabsContent value="reports" className="m-0">
                <AdminReportsTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  )
}
