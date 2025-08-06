'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      const botMessage = {
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error:', err);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 AimooGPT Chat</h1>

      <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            <p><strong>{msg.role === 'user' ? 'Kamu' : 'AimooGPT'}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>

      <textarea
        className="w-full p-3 border rounded"
        rows={3}
        placeholder="Ketik pertanyaanmu di sini..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        className="mt-2 px-4 py-2 bg-black text-white rounded"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? 'Mengirim...' : 'Kirim'}
      </button>
    </div>
  );
}
