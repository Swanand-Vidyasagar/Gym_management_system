"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, CreditCard, Users, Settings, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface DashboardLayoutProps {
  user: any
  children: React.ReactNode
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: CreditCard, label: "Memberships", href: "/memberships" },
    { icon: Settings, label: "Payments", href: "/payments" },
    ...(user?.role === "trainer" || user?.role === "admin" || user?.role === "staff"
      ? [{ icon: Users, label: "Staff Panel", href: "/staff" }]
      : []),
    ...(user?.role === "admin" ? [{ icon: Settings, label: "Admin Panel", href: "/admin" }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg text-foreground"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
                <span className="text-lg font-bold text-accent-foreground">💪</span>
              </div>
              <span className="font-bold text-xl text-foreground hidden sm:inline">FitHub</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative fixed inset-y-0 left-0 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out z-30 pt-4 md:pt-0 mt-16 md:mt-0`}
        >
          <div className="px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground hover:bg-muted"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
