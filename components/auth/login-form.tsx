"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface LoginFormProps {
  onToggle: () => void
}

export default function LoginForm({ onToggle }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await login(username, password)
      toast({
        title: "Success",
        description: "Welcome back!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Sign In</h2>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-foreground">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Try: swanand (admin), rohit_pawar, kavita_more (password: password123)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded-lg transition"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Don't have an account?</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-border text-foreground hover:bg-muted bg-transparent"
        onClick={onToggle}
      >
        Create New Account
      </Button>
    </form>
  )
}
