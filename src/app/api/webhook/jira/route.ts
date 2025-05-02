import { NextRequest, NextResponse } from 'next/server'
import { handleIssueCreated } from './jiraService'
import { scanWithVirusTotal } from './virusTotalService'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const issue = payload.issue

    if (!issue?.id || !issue?.key) {
      console.error('Invalid webhook payload:', payload)
      return NextResponse.json({ error: 'Missing issue data' }, { status: 400 })
    }

    console.log(`Webhook received for Jira issue ${issue.key} (ID: ${issue.id})`)
    const malicious = await handleIssueCreated(issue, scanWithVirusTotal)

    return NextResponse.json({ message: 'Done', malicious }, { status: 200 })
  } catch (err) {
    console.error('Error in POST /api/jira-webhook:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
