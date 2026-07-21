"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatDBPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Current chat session id
  const [chatId, setChatId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          chatId, // Send current chat id
        }),
      });

      const data = await response.json();

      // Store chatId only once (first message)
      if (!chatId) {
        setChatId(data.chatId);
      }

      const aiMessage: Message = {
        role: "assistant",
        content: data.text,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🤖 Somesh AI Chat
      </h1>

      <div className="flex-1 space-y-4 mb-24">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${
              message.role === "user"
                ? "bg-blue-500 text-white ml-16"
                : "bg-zinc-200 dark:bg-zinc-800 mr-16"
            }`}
          >
            <div className="font-bold mb-2">
              {message.role === "user" ? "You" : "AI"}
            </div>

            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-gray-500 animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t p-4"
      >
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 border rounded-lg p-3 dark:bg-zinc-900"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-5 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}