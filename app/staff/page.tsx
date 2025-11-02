"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import StaffMemberCard from "@/components/staff/staff-member-card"
import { useAuth } from "@/contexts/AuthContext"

export default function StaffPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
      return
    }
    if (!authLoading && user && user.role !== "trainer" && user.role !== "admin" && user.role !== "staff") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, authLoading, user, router])

  const staffMembers = [
    {
      id: 1,
      name: "Priya Deshpande",
      role: "Personal Trainer",
      email: "priya.deshpande@fithub.com",
      phone: "+91-98765-43211",
      location: "Floor 2",
      specialization: "Strength Training",
      experience: "5 years",
      membersAssigned: 12,
      rating: 4.8,
      image: "P",
    },
    {
      id: 2,
      name: "Amit Joshi",
      role: "Fitness Coach",
      email: "amit.joshi@fithub.com",
      phone: "+91-98765-43212",
      location: "Floor 1",
      specialization: "Cardio & HIIT",
      experience: "3 years",
      membersAssigned: 8,
      rating: 4.6,
      image: "A",
    },
    {
      id: 3,
      name: "Anjali Patil",
      role: "Nutritionist",
      email: "anjali.patil@fithub.com",
      phone: "+91-98765-43213",
      location: "Floor 3",
      specialization: "Nutrition Coaching",
      experience: "7 years",
      membersAssigned: 15,
      rating: 4.9,
      image: "A",
    },
    {
      id: 4,
      name: "Rajesh Kulkarni",
      role: "Manager",
      email: "rajesh.kulkarni@fithub.com",
      phone: "+91-98765-43210",
      location: "Floor 2",
      specialization: "Management & Training",
      experience: "6 years",
      membersAssigned: 10,
      rating: 4.7,
      image: "R",
    },
  ]

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Staff Directory</h1>
          <p className="text-muted-foreground">Connect with our team of professionals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Staff Members</p>
            <p className="text-3xl font-bold text-foreground">{staffMembers.length}</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Members Served</p>
            <p className="text-3xl font-bold text-foreground">
              {staffMembers.reduce((sum, s) => sum + s.membersAssigned, 0)}
            </p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Average Rating</p>
            <p className="text-3xl font-bold text-accent">
              {(staffMembers.reduce((sum, s) => sum + s.rating, 0) / staffMembers.length).toFixed(1)}★
            </p>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-card border-border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground pl-10"
              />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
              <Filter size={20} />
              Filter
            </Button>
          </div>
        </Card>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredStaff.map((staff) => (
            <StaffMemberCard key={staff.id} staff={staff} />
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card className="bg-card border-border p-12 text-center">
            <p className="text-muted-foreground mb-4">No staff members found matching your search</p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Clear Search
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
