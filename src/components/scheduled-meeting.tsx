"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MeetingLink } from "@/components/meeting-link"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function ScheduledMeeting() {
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("")
  const [meetingLink, setMeetingLink] = useState<string | null>(null)
  const [scheduledDateTime, setScheduledDateTime] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState(false)

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
  }

  const scheduleMeeting = () => {
    if (!date || !time) return

    setIsScheduling(true)

    // Simulate API call with a delay
    setTimeout(() => {
      // In a real app, this would call an API to schedule a Google Meet
      const randomId = Math.random().toString(36).substring(2, 10)
      const link = `https://meet.google.com/${randomId}`

      const formattedDate = format(date, "EEEE, MMMM d, yyyy")
      const formattedDateTime = `${formattedDate} at ${time}`

      setMeetingLink(link)
      setScheduledDateTime(formattedDateTime)
      setIsScheduling(false)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-pink-500 dark:text-pink-400">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal transition-all duration-300 border-pink-200 dark:border-pink-900 hover:border-pink-300 dark:hover:border-pink-800",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-pink-500 dark:text-pink-400" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-md border border-pink-200 dark:border-pink-900"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-pink-500 dark:text-pink-400">
            Time
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-pink-500 dark:text-pink-400" />
            <Input
              id="time"
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="pl-10 border-pink-200 dark:border-pink-900 focus-visible:ring-pink-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={scheduleMeeting}
        disabled={!date || !time || isScheduling}
        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {isScheduling ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
            Scheduling...
          </>
        ) : (
          "Schedule Meeting"
        )}
      </Button>

      {meetingLink && scheduledDateTime && (
        <MeetingLink link={meetingLink} dateTime={scheduledDateTime} type="scheduled" />
      )}
    </div>
  )
}
