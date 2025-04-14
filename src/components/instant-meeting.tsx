"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MeetingLink } from "@/components/meeting-link"
import { Video } from "lucide-react"

export function InstantMeeting() {
  const [meetingLink, setMeetingLink] = useState<string | null>(null)
  const [meetingTime, setMeetingTime] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMeetingLink = () => {
    setIsGenerating(true)

    // Simulate API call with a delay
    setTimeout(() => {
      // In a real app, this would call an API to generate a Google Meet link
      const randomId = Math.random().toString(36).substring(2, 10)
      const link = `https://meet.google.com/${randomId}`

      const now = new Date()
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      setMeetingLink(link)
      setMeetingTime(formattedTime)
      setIsGenerating(false)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={generateMeetingLink}
        disabled={isGenerating}
        className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {isGenerating ? (
          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <Video className="h-4 w-4" />
        )}
        {isGenerating ? "Generating..." : "Generate Instant Google Meet Link"}
      </Button>

      {meetingLink && meetingTime && <MeetingLink link={meetingLink} dateTime={meetingTime} type="instant" />}
    </div>
  )
}
