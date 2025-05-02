const VT_API_KEY = process.env.VT_API_KEY || ''

export async function scanWithVirusTotal(buffer: Buffer, filename: string): Promise<boolean> {
  console.log(`Sending ${filename} to VirusTotal...`)
  
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob, filename);

  const scanRes = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: { 'x-apikey': VT_API_KEY },
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
