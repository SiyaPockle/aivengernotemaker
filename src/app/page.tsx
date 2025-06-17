'use client'

import { useState } from 'react'
import htmlDocx from 'html-docx-js/dist/html-docx'

export default function Home() {
  const [subject, setSubject] = useState('')
  const [queries, setQueries] = useState('')
  const [result, setResult] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const rawQueriesArray = queries
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    // try {
    //   const response = await fetch(`http://127.0.0.1:8000/generate-notes`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ subject, raw_queries: rawQueriesArray }),
    //   })

    //   if (!response.ok) throw new Error('Failed to generate notes.')

    //   const data = await response.json()
    //   setResult(data.notes_html)
    //   setMarkdown(data.notes_md)
    // } catch (err) {
    //   console.error(err)
    //   setResult('Error generating notes. Please try again.')
    // } finally {
    //   setLoading(false)
    // }
      try {
      const response = await fetch(`https://siaaz-notemaking.hf.space/generate-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, raw_queries: rawQueriesArray }),
      })

      if (!response.ok) throw new Error('Failed to generate notes.')

      const data = await response.json()
      setResult(data.notes_html)
      setMarkdown(data.notes_md)
    } catch (err) {
      console.error(err)
      setResult('Error generating notes. Please try again.')
    } finally {
      setLoading(false)
    }

  }

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
  }

  const handleDownloadHtml = () => {
    const blob = new Blob([result], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${subject || 'notes'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadDocx = () => {
    const content = `
      <html>
        <head><meta charset="utf-8"></head>
        <body>${result}</body>
      </html>
    `
    const blob = htmlDocx.asBlob(content)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${subject || 'notes'}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main style={{
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      padding: '40px',
      color: 'white',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>
        Study Notes Generator
      </h1>

      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          padding: '24px',
          borderRadius: '10px',
          width: '45%',
          minWidth: '320px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>📄 Input Information</h2>
          <p style={{ fontSize: '14px', marginBottom: '15px', color: '#cbd5e1' }}>
            Enter a subject and your study questions to generate comprehensive notes
          </p>

          <label style={{ fontWeight: 'bold' }}>
            Subject (e.g., <i>Database_Management_System</i>)
          </label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              margin: '10px 0 20px',
              backgroundColor: '#f1f5f9',
              color: '#000'
            }}
          >
            <option value="">Select a subject</option>
            <option value="Artificial_Intelligence_And_Fuzzy_Logic">Artificial Intelligence and Fuzzy Logic</option>
            <option value="Computer_Forensic_Cyber_Security">Computer Forensics and Cyber Security</option>
            <option value="Cryptography_and_Network_Security">Cryptography and Network Security</option>
            <option value="Database_Management_System">Database Management System</option>
            <option value="Design_And_Analysis_Of_Algorithms">Design and Analysis of Algorithms</option>
            <option value="Management_And_Organizational_Behaviour">Management and Organizational Behaviour</option>
            <option value="Mobile_Computing">Mobile Computing</option>
            <option value="Technical_English_And_Report_Writing">Technical English and Report Writing</option>
          </select>

          <label style={{ fontWeight: 'bold' }}>Queries/Questions</label>
          <textarea
            rows={6}
            value={queries}
            onChange={e => setQueries(e.target.value)}
            placeholder="Enter your questions or topics (multiple questions will be automatically detected)"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '20px',
              backgroundColor: '#f1f5f9',
              color: '#000'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !subject || !queries.trim()}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading || !subject || !queries.trim() ? '#94a3b8' : '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !subject || !queries.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate Notes'}
          </button>
        </div>

        <div style={{
          backgroundColor: '#1e293b',
          padding: '24px',
          borderRadius: '10px',
          width: '50%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>📘 Generated Notes</h2>
          <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px' }}>
            Your comprehensive study notes will appear here
          </p>

          {!result && (
            <p style={{ color: '#94a3b8', marginTop: '20px' }}>
              Enter your subject and queries to generate notes
            </p>
          )}

          {result && (
            <>
              <button
                onClick={handleCopy}
                style={{
                  marginBottom: '12px',
                  padding: '10px 16px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                📋 Copy Markdown
              </button>

              <button
                onClick={handleDownloadHtml}
                style={{
                  marginBottom: '12px',
                  padding: '10px 16px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                💾 Download HTML
              </button>

              <button
                onClick={handleDownloadDocx}
                style={{
                  marginBottom: '16px',
                  padding: '10px 16px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                📄 Export as DOCX
              </button>

              <div
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  padding: '20px',
                  borderRadius: '8px',
                  overflowY: 'auto',
                  color: '#f8fafc',
                  flexGrow: 1,
                  maxHeight: '400px'
                }}
                dangerouslySetInnerHTML={{ __html: result }}
              />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
