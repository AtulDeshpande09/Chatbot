import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App()  {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m AgriBot 🌱. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5173/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error fetching response." }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6">AgriBot 🌾</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-4 flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.from === "bot"
                ? "bg-green-100 text-left self-start"
                : "bg-blue-100 text-right self-end ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crops, soil, fertilizers..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
