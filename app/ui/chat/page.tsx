"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const [input, setInput] = useState("");

  // const { messages, sendMessage, status, error, stop } = useChat({
  //   api: "/api/chat",
  // });
  const { messages, sendMessage, status, error, stop } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({ text: input });

    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto min-h-screen py-8">

      <h1 className="text-3xl font-bold text-center mb-8">
        🤖 Somesh AI Chat
      </h1>

      <div className="flex-1 space-y-4 mb-24">
        {error && (
          <div className="text-red-500">
            {error.message}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-xl ${
              message.role === "user"
                ? "bg-blue-500 text-white ml-16"
                : "bg-zinc-200 dark:bg-zinc-800 mr-16"
            }`}
          >
            <div className="font-bold mb-2">
              {message.role === "user" ? "You" : "AI"}
            </div>

            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <div
                    key={`${message.id}-${index}`}
                    className="whitespace-pre-wrap"
                  >
                    {part.text}
                  </div>
                );
              }

              return null;
            })}
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
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

          {status === "submitted" || status === "streaming" ? (
            <button
              type="button"
              onClick={stop}
              className="bg-red-500 text-white px-5 rounded-lg"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={status !== "ready"}
              className="bg-blue-500 text-white px-5 rounded-lg"
            >
              Send
            </button>
          )}

        </div>
      </form>

    </div>
  );
}