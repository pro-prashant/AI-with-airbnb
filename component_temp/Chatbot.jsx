
"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatbotUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi 👋 Welcome to Airbnb! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const botMessage = { role: "bot", content: data.reply || "Sorry, I didn't understand that." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", content: "⚠️ Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-red-600 text-white flex justify-between items-center px-4 py-2">
            <h2 className="font-semibold">Airbnb Assistant</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.role === "user"
                    ? "bg-red-100 self-end ml-auto"
                    : "bg-gray-100 self-start mr-auto"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="bg-gray-100 p-2 rounded-lg w-fit">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 cursor-pointer"
              disabled={loading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotUI;
