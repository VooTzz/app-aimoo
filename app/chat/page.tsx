'use client'

import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'Halo! Ada yang bisa saya bantu?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan.')
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.message }])
      }
    } catch (err) {
      setError('Gagal menghubungi server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AimooGpt</h1>

      <div className="space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 text-right' : msg.role === 'assistant' ? 'bg-green-100' : 'text-gray-500 italic'
            }`}
          >
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ketik pesan..."
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={handleSend}
          disabled={loading}
        >
          Kirim
        </button>
      </div>
    </div>
  )
}
