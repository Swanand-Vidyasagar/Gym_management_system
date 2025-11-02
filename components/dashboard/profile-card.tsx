"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Edit } from "lucide-react"

interface ProfileCardProps {
  user: any
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="bg-card border-border p-6">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-accent-foreground">{user.name.charAt(0).toUpperCase()}</span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-foreground mb-1">{user.name}</h3>
        <p className="text-sm text-muted-foreground capitalize mb-6">
          {user.role === "member" ? "Member" : user.role === "trainer" ? "Personal Trainer" : "Administrator"}
        </p>

        {/* Contact Info */}
        <div className="w-full space-y-3 mb-6 text-left">
          <div className="flex items-center gap-3 text-foreground">
            <Mail size={18} className="text-accent flex-shrink-0" />
            <span className="text-sm break-all">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Phone size={18} className="text-accent flex-shrink-0" />
            <span className="text-sm">{user.phone || (user.role === 'admin' ? '+91-98765-43220' : '+91-98765-43221')}</span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <MapPin size={18} className="text-accent flex-shrink-0" />
            <span className="text-sm">
              {user.address 
                ? (user.address.includes(',') ? user.address.split(',').slice(-2).join(',').trim() : user.address)
                : user.role === 'admin' 
                  ? 'Pune, Maharashtra' 
                  : 'Mumbai, Maharashtra'}
            </span>
          </div>
        </div>

        {/* Edit Button */}
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>
    </Card>
  )
}
