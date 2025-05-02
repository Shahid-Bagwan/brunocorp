const JIRA_BASE_URL = process.env.JIRA_BASE_URL || ''
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || ''
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || ''

const JIRA_BASIC_AUTH = `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`

export async function handleIssueCreated(issue: any, scanFile: (buffer: Buffer, filename: string) => Promise<boolean>): Promise<boolean> {
  const attachments = issue.fields?.attachment || []
  if (!attachments.length) {
    console.log('No attachments found on issue', issue.key)
    return false
  }
  console.log(`Found ${attachments.length} attachments on issue ${issue.key}`)

  for (const a of attachments) {
    console.log(`Processing attachment ${a.filename} (ID: ${a.id})`)
    try {
      const fileData = await fetch(a.content, {
        headers: { 'Authorization': JIRA_BASIC_AUTH }
      }).then(res => res.arrayBuffer())
      
      const buffer = Buffer.from(fileData)
      const isMalicious = await scanFile(buffer, a.filename)

      if (isMalicious) {
        console.log(`Attachment ${a.filename} is malicious. Deleting...`)
        const delRes = await fetch(
          `${JIRA_BASE_URL}/attachment/${a.id}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': JIRA_BASIC_AUTH }
          }
        )
        if (!delRes.ok) console.error(`Failed to delete attachment: ${delRes.status}`)
        else console.log(`Deleted attachment ${a.id}`)
        return true
      }
      console.log(`Attachment ${a.filename} is clean.`)
    } catch (e) {
      console.error('Error processing attachment', a.id, e)
    }
  }
  return false
}
