"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Star, MessageSquare, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StaffMemberCardProps {
  staff: any
}

export default function StaffMemberCard({ staff }: StaffMemberCardProps) {
  const { toast } = useToast()
  const [showDetails, setShowDetails] = useState(false)

  const handleContact = (method: string) => {
    toast({
      title: "Contact Initiated",
      description: `Contacting ${staff.name} via ${method}...`,
    })
  }

  return (
    <Card className="bg-card border-border overflow-hidden hover:shadow-lg transition">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-accent-foreground">
              {staff.image}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{staff.name}</h3>
              <p className="text-sm text-accent font-semibold">{staff.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-background/50 rounded px-3 py-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-foreground">{staff.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Main Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Specialization</p>
          <p className="font-semibold text-foreground">{staff.specialization}</p>
        </div>

        {/* Experience */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Experience</p>
            <p className="font-semibold text-foreground">{staff.experience}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="font-semibold text-accent">{staff.membersAssigned}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-accent" />
            <span className="text-foreground break-all">{staff.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-accent" />
            <span className="text-foreground">{staff.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-accent" />
            <span className="text-foreground">{staff.location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            onClick={() => handleContact("Email")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
          >
            <Mail size={16} className="mr-2" />
            Email
          </Button>
          <Button
            onClick={() => handleContact("Message")}
            variant="outline"
            className="border-border text-foreground hover:bg-muted text-sm"
          >
            <MessageSquare size={16} className="mr-2" />
            Message
          </Button>
        </div>

        {/* Book Session Button */}
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="w-full border-border text-foreground hover:bg-muted text-sm"
        >
          <BookOpen size={16} className="mr-2" />
          {showDetails ? "Hide Details" : "Book Session"}
        </Button>

        {/* Details Section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">AVAILABILITY</p>
              <div className="space-y-1 text-sm">
                <p className="text-foreground">Mon-Wed, Fri: 9 AM - 6 PM</p>
                <p className="text-foreground">Thu: 12 PM - 8 PM</p>
                <p className="text-foreground">Sat-Sun: 10 AM - 4 PM</p>
              </div>
            </div>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => {
                toast({
                  title: "Session Booking",
                  description: `Book a session with ${staff.name}`,
                })
              }}
            >
              Schedule Session
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
