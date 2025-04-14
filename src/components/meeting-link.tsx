"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Copy, ExternalLink } from "lucide-react"

interface MeetingLinkProps {
  link: string
  dateTime: string
  type?: "instant" | "scheduled"
}

export function MeetingLink({ link, dateTime, type = "instant" }: MeetingLinkProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const gradientClass =
    type === "instant"
      ? "from-purple-500/10 to-purple-700/10 dark:from-purple-500/20 dark:to-purple-700/20 border-purple-200 dark:border-purple-900"
      : "from-pink-500/10 to-pink-700/10 dark:from-pink-500/20 dark:to-pink-700/20 border-pink-200 dark:border-pink-900"

  const accentColor = type === "instant" ? "text-purple-500 dark:text-purple-400" : "text-pink-500 dark:text-pink-400"

  return (
    <Card className={`p-4 mt-4 bg-gradient-to-br ${gradientClass} border shadow-md animate-fadeIn`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium ${accentColor}`}>Meeting Link</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className={`h-8 px-2 group border-${type === "instant" ? "purple" : "pink"}-200 dark:border-${type === "instant" ? "purple" : "pink"}-900 hover:bg-${type === "instant" ? "purple" : "pink"}-100 dark:hover:bg-${type === "instant" ? "purple" : "pink"}-900/30`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
              ) : (
                <Copy className={`h-3.5 w-3.5 mr-1 group-hover:${accentColor}`} />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`h-8 px-2 group border-${type === "instant" ? "purple" : "pink"}-200 dark:border-${type === "instant" ? "purple" : "pink"}-900 hover:bg-${type === "instant" ? "purple" : "pink"}-100 dark:hover:bg-${type === "instant" ? "purple" : "pink"}-900/30`}
            >
              <a href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className={`h-3.5 w-3.5 mr-1 group-hover:${accentColor}`} />
                Open
              </a>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{dateTime}</p>
          <p className={`text-sm font-medium ${accentColor} break-all`}>{link}</p>
        </div>
      </div>
    </Card>
  )
}
