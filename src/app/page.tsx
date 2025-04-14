"use client"

import { useSession } from "next-auth/react"
import { AuthButton } from "@/components/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoggedIn = !!session

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Meeting Scheduler
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </header>

        {isLoggedIn ? (
          <div className="text-center py-16 px-4 rounded-lg bg-gradient-to-br from-background to-muted border border-border shadow-lg">
            <h2 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Welcome, {session.user?.name}!
            </h2>
            <p className="text-muted-foreground mb-6">
              You're signed in and ready to schedule meetings
            </p>
            <Button 
              onClick={() => router.push('/meeting')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Go to Meeting Scheduler
            </Button>
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-lg bg-gradient-to-br from-background to-muted border border-border shadow-lg">
            <h2 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Please sign in to schedule meetings
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in with your Google account to access the meeting scheduler
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
