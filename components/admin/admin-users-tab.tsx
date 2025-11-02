"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Eye, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersTab() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const users = [
    {
      id: 1,
      name: "Swanand Vidyasagar",
      email: "swanand.vidyasagar@example.com",
      phone: "+91-98765-43220",
      joinDate: "2024-01-15",
      status: "active",
      membershipType: "Premium Plus",
    },
    {
      id: 2,
      name: "Rohit Pawar",
      email: "rohit.pawar@example.com",
      phone: "+91-98765-43221",
      joinDate: "2024-03-22",
      status: "active",
      membershipType: "Basic",
    },
    {
      id: 3,
      name: "Kavita More",
      email: "kavita.more@example.com",
      phone: "+91-98765-43222",
      joinDate: "2023-11-10",
      status: "inactive",
      membershipType: "Premium Plus",
    },
    {
      id: 4,
      name: "Vikram Chavan",
      email: "vikram.chavan@example.com",
      phone: "+91-98765-43223",
      joinDate: "2024-02-05",
      status: "active",
      membershipType: "Elite Pro",
    },
  ]

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAction = (action: string, userId: number) => {
    toast({
      title: "Action Completed",
      description: `${action} user ${userId}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Name</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Email</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Membership</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Join Date</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Status</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="py-4 px-4 text-foreground font-medium">{user.name}</td>
                <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                <td className="py-4 px-4 text-foreground text-sm">{user.membershipType}</td>
                <td className="py-4 px-4 text-muted-foreground text-sm">{user.joinDate}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                      user.status === "active" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-foreground hover:bg-muted text-xs bg-transparent"
                      onClick={() => handleAction("View", user.id)}
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-foreground hover:bg-muted text-xs bg-transparent"
                      onClick={() => handleAction("Edit", user.id)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs bg-transparent"
                      onClick={() => handleAction("Delete", user.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
