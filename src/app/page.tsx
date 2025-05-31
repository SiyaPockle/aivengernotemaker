// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
'use client'

import { useState } from 'react'
import htmlDocx from 'html-docx-js/dist/html-docx'

export default function Home() {
  const [subject, setSubject] = useState('')
  const [queries, setQueries] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

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

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(result)
  //   setCopied(true)
  //   setTimeout(() => setCopied(false), 2000)
  // }
  const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed"; // avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.error('Fallback: Copy command was unsuccessful');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
};

const handleCopy = () => {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => fallbackCopyTextToClipboard(result));
  } else {
    fallbackCopyTextToClipboard(result);
  }
};



  const handleExportDocx = () => {
    const content = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * {
              color: black !important;
              background-color: white !important;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>${result}</body>
      </html>
    `
    const converted = htmlDocx.asBlob(content)
    const link = document.createElement('a')
    link.href = URL.createObjectURL(converted)
    link.download = `${subject || 'notes'}.docx`
    link.click()
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
            <option value="Database_Management_System">Database Management System</option>
            <option value="Cryptography_and_Network_Security">Cryptography and Network Security</option>
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
