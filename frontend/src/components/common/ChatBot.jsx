import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { apiClient } from '../../services/apiClient.js'

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Arpan AI. Ask me anything about tasks, needs, events, or the platform." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const { data } = await apiClient.post('/api/chatbot', { message: text })
      setMessages(m => [...m, { role: 'bot', text: data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'bot', text: "Sorry, I couldn't process that. Please try again." }])
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
          width: 360, maxWidth: 'calc(100vw - 2rem)', height: 480, maxHeight: 'calc(100vh - 3rem)',
          background: 'var(--af-card, #fff)', border: '1px solid var(--af-border, #e5e7eb)',
          borderRadius: '16px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem', borderBottom: '1px solid var(--af-border, #e5e7eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <span style={{ fontWeight: 700 }}>Arpan AI</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.6rem 0.9rem', borderRadius: '12px',
                  fontSize: '0.85rem', lineHeight: 1.5,
                  background: msg.role === 'user' ? '#6366f1' : 'var(--af-border, #f1f5f9)',
                  color: msg.role === 'user' ? '#fff' : 'inherit',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.6rem 0.9rem', borderRadius: '12px', background: 'var(--af-border, #f1f5f9)', fontSize: '0.85rem' }}>
                  <span className="af-spinner" style={{ width: 16, height: 16 }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--af-border, #e5e7eb)', display: 'flex', gap: '0.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px',
                border: '1px solid var(--af-border, #e5e7eb)', outline: 'none',
                fontSize: '0.85rem', background: 'transparent', color: 'inherit',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                background: '#6366f1', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer',
                opacity: !input.trim() || loading ? 0.5 : 1,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
