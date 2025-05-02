import { NextRequest, NextResponse } from 'next/server'

// Runtime can be 'edge' or 'nodejs'. Here we use nodejs.
export const runtime = 'nodejs'

// Env vars (set these in your deployment)
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || ''
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || ''
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || ''
const VT_API_KEY = process.env.VT_API_KEY || ''

// Precompute Basic Auth header for Jira
const JIRA_BASIC_AUTH = `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const issue = payload.issue

    if (!issue?.id || !issue?.key) {
      console.error('Invalid webhook payload:', payload)
      return NextResponse.json({ error: 'Missing issue data' }, { status: 400 })
    }

    console.log(`Webhook received for Jira issue ${issue.key} (ID: ${issue.id})`)
    const malicious = await handleIssueCreated(issue)

    return NextResponse.json({ message: 'Done', malicious }, { status: 200 })
  } catch (err) {
    console.error('Error in POST /api/jira-webhook:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function handleIssueCreated(issue: any): Promise<boolean> {
  const attachments = issue.fields?.attachment || []
  if (!attachments.length) {
    console.log('No attachments found on issue', issue.key)
    return false
  }
  console.log(`Found ${attachments.length} attachments on issue ${issue.key}`)

  for (const a of attachments) {
    console.log(`Processing attachment ${a.filename} (ID: ${a.id})`)
    try {
      // Get the attachment data directly from the content field
      const fileData = await fetch(a.content, {
        headers: {
          'Authorization': JIRA_BASIC_AUTH
        }
      }).then(res => res.arrayBuffer())
      
      const buffer = Buffer.from(fileData)

      // 2) Scan via VirusTotal
      const isMalicious = await scanWithVirusTotal(buffer, a.filename)

      if (isMalicious) {
        console.log(`Attachment ${a.filename} is malicious. Deleting...`)
        // 3) Delete from Jira
        const delRes = await fetch(
          `${JIRA_BASE_URL}/attachment/${a.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': JIRA_BASIC_AUTH
            }
          }
        )
        if (!delRes.ok) console.error(`Failed to delete attachment: ${delRes.status}`)
        else console.log(`Deleted attachment ${a.id}`)
        return true
      } else {
        console.log(`Attachment ${a.filename} is clean.`)
      }
    } catch (e) {
      console.error('Error processing attachment', a.id, e)
    }
  }

  return false
}

async function scanWithVirusTotal(buffer: Buffer, filename: string): Promise<boolean> {
  console.log(`Sending ${filename} to VirusTotal...`)
  
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob, filename);

  const scanRes = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': VT_API_KEY,
    },
    body: formData
  })

  if (!scanRes.ok) {
    console.error('VirusTotal scan upload failed:', scanRes.status)
    return false
  }

  const scanJson = await scanRes.json()
  console.log('VirusTotal scan response:', scanRes.status, scanJson)
  const analysisId = scanJson.data.id
  console.log('Got VirusTotal analysis ID:', analysisId)

  // Fetch the analysis report
  const reportRes = await fetch(
    `https://www.virustotal.com/api/v3/analyses/${encodeURIComponent(analysisId)}`,
    {
      method: 'GET',
      headers: { 'x-apikey': VT_API_KEY }
    }
  )
  if (!reportRes.ok) {
    console.error('Failed fetching VT report:', reportRes.status)
    return false
  }
  const reportJson = await reportRes.json()
  const stats = reportJson.data.attributes.stats
  console.log('Scan stats:', stats)

  return stats.malicious > 0
}
