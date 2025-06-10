'use client'

import { useState } from 'react'
// htmlDocx import is no longer needed if handleExportDocx is removed
// import htmlDocx from 'html-docx-js/dist/html-docx'

export default function Home() {
  const [subject, setSubject] = useState('')
  const [queries, setQueries] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  // 'copied' state is no longer needed
  // const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const rawQueriesArray = queries
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    try {
      const response = await fetch(`https://siaaz-notemaking.hf.space/generate-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, raw_queries: rawQueriesArray }),
      })

      if (!response.ok) throw new Error('Failed to generate notes.')

      const data = await response.json()
      setResult(data.notes_html)
    } catch (err) {
      console.error(err)
      setResult('Error generating notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // handleCopy and fallbackCopyTextToClipboard functions are removed
  // const fallbackCopyTextToClipboard = (text: string) => {
  //   const textArea = document.createElement("textarea");
  //   textArea.value = text;
  //   textArea.style.position = "fixed"; // avoid scrolling to bottom
  //   document.body.appendChild(textArea);
  //   textArea.focus();
  //   textArea.select();

  //   try {
  //     const successful = document.execCommand('copy');
  //     if (successful) {
  //       setCopied(true);
  //       setTimeout(() => setCopied(false), 2000);
  //     } else {
  //       console.error('Fallback: Copy command was unsuccessful');
  //     }
  //   } catch (err) {
  //     console.error('Fallback: Oops, unable to copy', err);
  //   }

  //   document.body.removeChild(textArea);
  // };

  // const handleCopy = () => {
  //   if (navigator?.clipboard?.writeText) {
  //     navigator.clipboard.writeText(result)
  //       .then(() => {
  //         setCopied(true);
  //         setTimeout(() => setCopied(false), 2000);
  //       })
  //       .catch(() => fallbackCopyTextToClipboard(result));
  //   } else {
  //     fallbackCopyTextToClipboard(result);
  //   }
  // };

  // handleExportDocx function is removed
  // const handleExportDocx = () => {
  //   const content = `
  //     <html>
  //       <head>
  //         <meta charset="utf-8">
  //         <style>
  //           * {
  //             color: black !important;
  //             background-color: white !important;
  //             font-family: Arial, sans-serif;
  //           }
  //         </style>
  //       </head>
  //       <body>${result}</body>
  //     </html>
  //   `
  //   const converted = htmlDocx.asBlob(content)
  //   const link = document.createElement('a')
  //   link.href = URL.createObjectURL(converted)
  //   link.download = `${subject || 'notes'}.docx`
  //   link.click()
  // }

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
        {/* Left Column - Input */}
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
            <option value="Management_And_Organizational_Behaviour">Management And Organizational Behaviour</option>
            <option value="Mobile_Computing">Mobile Computing</option>
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

        {/* Right Column - Output */}
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
              {/* The div containing copy and export buttons is now removed */}
              {/*
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '10px',
                marginTop: '10px'
              }}>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                </button>

                <button
                  onClick={handleExportDocx}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  📄 Export as DOCX
                </button>
              </div>
              */}

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