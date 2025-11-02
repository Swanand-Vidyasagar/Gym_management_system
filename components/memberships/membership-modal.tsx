"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MembershipModalProps {
  plan: any
  onClose: () => void
  user: any
}

export default function MembershipModal({ plan, onClose, user }: MembershipModalProps) {
  const [step, setStep] = useState("confirm")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  const handleConfirmPurchase = () => {
    setStep("payment")
  }

  const handlePayment = async () => {
    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Successfully subscribed to ${plan.name} plan!`,
      })
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  const handleCardChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-card border-border max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg text-foreground">
          <X size={20} />
        </button>

        {step === "confirm" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Subscribe to {plan.name}</h3>
              <p className="text-muted-foreground">Review your membership details</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground">Plan</span>
                <span className="font-semibold text-foreground">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Billing Period</span>
                <span className="font-semibold text-foreground capitalize">{plan.period}ly</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-foreground font-semibold">Total</span>
                <span className="font-bold text-accent text-lg">
                  ₹{typeof plan.price === 'number' ? plan.price.toLocaleString('en-IN') : plan.price}/{plan.period}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirmPurchase}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                Continue to Payment
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Payment Details</h3>
              <p className="text-muted-foreground">Enter your payment information</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-2 block">Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardChange("cardNumber", e.target.value)}
                  className="bg-background border-border text-foreground"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label className="text-foreground mb-2 block">Card Holder Name</Label>
                <Input
                  placeholder="Full Name"
                  value={cardData.cardHolder}
                  onChange={(e) => handleCardChange("cardHolder", e.target.value)}
                  className="bg-background border-border text-foreground"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground mb-2 block">Expiry Date</Label>
                  <Input
                    placeholder="MM/YY"
                    value={cardData.expiryDate}
                    onChange={(e) => handleCardChange("expiryDate", e.target.value)}
                    className="bg-background border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">CVV</Label>
                  <Input
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleCardChange("cvv", e.target.value)}
                    className="bg-background border-border text-foreground"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Complete Payment"}
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted"
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
