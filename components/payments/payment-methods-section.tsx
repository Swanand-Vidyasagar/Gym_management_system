"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentMethodsSection() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "credit",
      last4: "4242",
      brand: "Visa",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "debit",
      last4: "5555",
      brand: "Mastercard",
      expiryDate: "08/27",
      isDefault: false,
    },
  ])

  const { toast } = useToast()

  const handleSetDefault = (id: number) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
    toast({
      title: "Success",
      description: "Payment method set as default",
    })
  }

  const handleDelete = (id: number) => {
    setPaymentMethods((methods) => methods.filter((m) => m.id !== id))
    toast({
      title: "Success",
      description: "Payment method removed",
    })
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">Payment Methods</h3>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 flex items-center justify-between transition ${
              method.isDefault ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <CreditCard size={24} className="text-accent" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {method.brand} ending in {method.last4}
                  </p>
                  {method.isDefault && (
                    <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">Default</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <Button
                  onClick={() => handleSetDefault(method.id)}
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-muted text-xs"
                >
                  Set Default
                </Button>
              )}
              <Button
                onClick={() => handleDelete(method.id)}
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
