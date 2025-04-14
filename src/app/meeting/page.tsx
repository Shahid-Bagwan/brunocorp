"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InstantMeeting } from "@/components/instant-meeting"
import { ScheduledMeeting } from "@/components/scheduled-meeting"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MeetingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted transition-colors duration-300 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Meeting Scheduler
          </h1>
          <ThemeToggle />
        </header>

        <div className="space-y-8">
          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-500 dark:text-purple-400">Instant Meeting</CardTitle>
              <CardDescription>Generate a Google Meet link for an immediate meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <InstantMeeting />
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-pink-500 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-pink-500 dark:text-pink-400">Scheduled Meeting</CardTitle>
              <CardDescription>Schedule a meeting for a future date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduledMeeting />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 