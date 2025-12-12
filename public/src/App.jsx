import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

export default function App() {

  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi — I'm an AI assistant! Ask me anything about the portfolio owner." }
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // call Netlify function
      const resp = await axios.post('/api/gemini-chat', {
        messages: [...messages, userMsg]
      })

      const botText = resp.data?.reply || 'Sorry, I had trouble answering that.'
      setMessages(prev => [...prev, { role: 'bot', text: botText }])

    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'bot', text: 'An error occurred while talking to the AI.' }])

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, padding: 24, minHeight:'100vh' }}>
      
      <main style={{ padding: 24 }}>
        <header>
          <h1 style={{ margin: 0 }}>Your Name — Title</h1>
          <p style={{ color: '#666' }}>Short tagline. Designer • Developer • Problem solver</p>
        </header>

        <section style={{ marginTop: 24 }}>
          <h2>Featured Work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginTop: 12 }}>
            <article style={{ padding: 12, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
              <h3>Project A</h3>
              <p>Short project description that sells the idea.</p>
            </article>
            <article style={{ padding: 12, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
              <h3>Project B</h3>
              <p>Short project description that sells the idea.</p>
            </article>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          <h2>About Me</h2>
          <p>Write 2–3 lines about yourself here. This is also fed into Gemini so the chatbot can answer about you.</p>
        </section>

        <footer style={{ marginTop: 48, color: '#888' }}>
          © {new Date().getFullYear()} Your Name — Built with ♥ and Gemini
        </footer>
      </main>

      <aside style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: 0 }}>Chat with me</h3>

        <div style={{ height: '56vh', overflowY: 'auto', padding: 8, borderRadius: 8, background: '#fafafa' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ margin: '8px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 12,
                maxWidth: '85%',
                boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                background: m.role === 'user' ? '#111' : '#fff',
                color: m.role === 'user' ? '#fff' : '#111'
              }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={sendMessage} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about me..."
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #eee' }}
          />
          <button type="submit" disabled={isLoading} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#111', color: '#fff' }}>
            {isLoading ? '...' : 'Send'}
          </button>
        </form>

        <small style={{ display: 'block', marginTop: 12, color: '#888' }}>
          Tip: include the word “portfolio” or “experience” for focused answers.
        </small>
      </aside>
    </div>
  )
}
