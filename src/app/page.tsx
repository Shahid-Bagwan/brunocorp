"use client"

import { useState } from "react"
import { AuthButton } from "@/components/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // Redirect to meeting page when logged in
  if (isLoggedIn) {
    router.push('/meeting')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Meeting Scheduler
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButton isLoggedIn={isLoggedIn} onLoginChange={setIsLoggedIn} />
          </div>
        </header>

        <div className="text-center py-16 px-4 rounded-lg bg-gradient-to-br from-background to-muted border border-border shadow-lg">
          <h2 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Please sign in to schedule meetings
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in with your Google account to access the meeting scheduler
          </p>
          <AuthButton isLoggedIn={isLoggedIn} onLoginChange={setIsLoggedIn} />
        </div>
      </div>
    </div>
  )
}
