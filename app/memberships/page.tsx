"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import MembershipModal from "@/components/memberships/membership-modal"
import { useAuth } from "@/contexts/AuthContext"

export default function MembershipsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [selectedMembership, setSelectedMembership] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router])

  const membershipPlans = [
    {
      id: 1,
      name: "Basic",
      price: 999,
      period: "month",
      description: "Perfect for getting started",
      features: ["Access to gym facilities", "Locker room access", "Basic equipment", "Email support"],
      notIncluded: ["Personal trainer", "Classes", "Group sessions"],
      popular: false,
    },
    {
      id: 2,
      name: "Premium Plus",
      price: 2499,
      period: "month",
      description: "Most popular choice",
      features: [
        "All Basic features",
        "Unlimited classes",
        "Group training sessions",
        "Priority support",
        "Fitness assessment",
        "Nutrition guide",
      ],
      notIncluded: ["Personal trainer"],
      popular: true,
    },
    {
      id: 3,
      name: "Elite Pro",
      price: 4999,
      period: "month",
      description: "Complete fitness solution",
      features: [
        "All Premium features",
        "8 Personal training sessions",
        "One-on-one nutrition coaching",
        "24/7 phone support",
        "Recovery services",
        "Monthly performance review",
      ],
      notIncluded: [],
      popular: false,
    },
    {
      id: 4,
      name: "Annual Unlimited",
      price: 8999,
      period: "year",
      description: "Best value - save 25%",
      features: [
        "All Elite Pro features",
        "Unlimited personal training",
        "Unlimited classes",
        "VIP lounge access",
        "Guest privileges (12x/year)",
        "Annual health screening",
      ],
      notIncluded: [],
      popular: false,
    },
  ]

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

  const handleSelectMembership = (plan: any) => {
    setSelectedMembership(plan)
    setShowModal(true)
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Membership Plans</h1>
          <p className="text-muted-foreground">Choose the perfect plan for your fitness journey</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`border relative flex flex-col h-full transition-all hover:shadow-lg ${
                plan.popular ? "border-accent bg-card/50 ring-2 ring-accent" : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      {plan.notIncluded.map((feature, index) => (
                        <div key={`not-${index}`} className="flex items-start gap-3">
                          <X size={18} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <Button
                  onClick={() => handleSelectMembership(plan)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {plan.popular ? "Choose Plan" : "Select Plan"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                question: "Can I upgrade or downgrade my membership?",
                answer:
                  "Yes, you can change your membership plan at any time. Changes will be reflected in your next billing cycle.",
              },
              {
                question: "Is there a cancellation fee?",
                answer:
                  "No, you can cancel your membership at any time with no cancellation fees. Your access ends at the end of your current billing period.",
              },
              {
                question: "Do you offer day passes?",
                answer:
                  "Yes, day passes are available for ₹500. They provide full access to all gym facilities for 24 hours.",
              },
              {
                question: "Can I freeze my membership?",
                answer:
                  "Yes, you can freeze your membership for up to 3 months at no additional cost. Contact our support team for more details.",
              },
            ].map((item, index) => (
              <div key={index}>
                <h4 className="font-semibold text-foreground mb-2">{item.question}</h4>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showModal && selectedMembership && (
        <MembershipModal plan={selectedMembership} onClose={() => setShowModal(false)} user={user} />
      )}
    </DashboardLayout>
  )
}
