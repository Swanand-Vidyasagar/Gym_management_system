"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddPaymentModalProps {
  onClose: () => void
}

export default function AddPaymentModal({ onClose }: AddPaymentModalProps) {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddPayment = async () => {
    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Payment method added successfully",
      })
      setIsLoading(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-card border-border max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg text-foreground">
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-foreground mb-6">Add Payment Method</h3>

        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-2 block">Card Number</Label>
            <Input
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
              maxLength={16}
            />
          </div>

          <div>
            <Label className="text-foreground mb-2 block">Card Holder Name</Label>
            <Input
              placeholder="Swanand Vidyasagar"
              value={cardData.cardHolder}
              onChange={(e) => handleChange("cardHolder", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-2 block">Expiry Date</Label>
              <Input
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="text-foreground mb-2 block">CVV</Label>
              <Input
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) => handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
                type="password"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleAddPayment}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Payment Method"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-muted bg-transparent"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}
