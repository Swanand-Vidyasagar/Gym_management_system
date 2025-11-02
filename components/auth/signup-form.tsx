"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface SignupFormProps {
  onToggle: () => void
}

export default function SignupForm({ onToggle }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.username || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        username: formData.username,
        password: formData.password,
      })
      toast({
        title: "Success",
        description: "Account created successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Create Account</h2>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Swanand Vidyasagar"
          value={formData.name}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+91-98765-43210"
          value={formData.phone}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-foreground">
          Address (Optional)
        </Label>
        <Input
          id="address"
          name="address"
          type="text"
          placeholder="Flat 201, ABC Society, Pune, Maharashtra 411001"
          value={formData.address}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-foreground">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded-lg transition"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-border text-foreground hover:bg-muted bg-transparent"
        onClick={onToggle}
      >
        Back to Sign In
      </Button>
    </form>
  )
}
