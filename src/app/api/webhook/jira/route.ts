import { NextRequest, NextResponse } from 'next/server'



export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    console.log('Received Jira webhook payload:', payload)
    const issue = payload.issue

    if (!issue?.id || !issue?.key) {
      return NextResponse.json(
        { error: 'Invalid payload: missing issue.id or issue.key' },
        { status: 400 }
      )
    }

    const issueId = issue.id
    const issueKey = issue.key

    // Delegate the actual processing to a separate function
    await handleIssueCreated({ issueId, issueKey })

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
  } catch (err: unknown) {
    console.error('Error in Jira webhook handler:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleIssueCreated({ issueId, issueKey }: { issueId: string; issueKey: string }) {
  // TODO: 1) Call Jira's REST API to list and download attachments
  //       2) Send attachments to VirusTotal for scanning
  //       3) Delete any malicious attachments via Jira API
  
  console.log(`Processing Jira issue ${issueKey} (ID: ${issueId})`)
  
  // Example placeholder:
  // const attachments = await listJiraAttachments(issueId)
  // for (const a of attachments) {
  //   const fileBuffer = await downloadJiraAttachment(a.content)
  //   const report = await scanWithVirusTotal(fileBuffer)
  //   if (report.positives > 0) {
  //     await deleteJiraAttachment(a.id)
  //   }
  // }
}
