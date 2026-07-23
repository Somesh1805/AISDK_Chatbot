"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Session = {
  id: string;
  title: string;
};

export default function ChatDBPage() {
  const searchParams = useSearchParams();

  const existingSessionId = searchParams.get("sessionId");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(
    existingSessionId
  );

  // Load all sessions
  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch("/api/sessions");

        if (!res.ok) return;

        const data = await res.json();

        setSessions(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadSessions();
  }, []);
  async function handleNewChat() {
  const res = await fetch("/api/new-session", {
    method: "POST",
  });

  const data = await res.json();

  setSessionId(data.id);

  setMessages([]);

  const sessionsRes = await fetch("/api/sessions");
  const sessions = await sessionsRes.json();

  setSessions(sessions);
}

async function loadConversation(sessionId: string) {
  const res = await fetch("/api/load-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
    }),
  });

  const data = await res.json();

  const loadedMessages: Message[] = [];

  data.userMessages.forEach(
    (user: { content: string }, index: number) => {
      loadedMessages.push({
        role: "user",
        content: user.content,
      });

      if (data.assistantMessages[index]) {
        loadedMessages.push({
          role: "assistant",
          content: data.assistantMessages[index].content,
        });
      }
    }
  );

  setMessages(loadedMessages);
}

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      });

      const data = await response.json();

      setSessions((prev) =>
  prev.map((session) =>
    session.id === data.sessionId
      ? {
          ...session,
          title: data.title,
        }
      : session
  )
);

      if (!sessionId) {
        setSessionId(data.sessionId);
      }

      const aiMessage: Message = {
        role: "assistant",
        content: data.text,
      };

      setMessages((prev) => [...prev, aiMessage]);
      const sessionsRes = await fetch("/api/sessions");
const updatedSessions = await sessionsRes.json();

setSessions(updatedSessions);

      setInput("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}

      <div className="w-72 border-r bg-zinc-100 dark:bg-zinc-900 p-4">

       <button
  onClick={handleNewChat}
  className="w-full bg-blue-500 text-white py-2 rounded-lg mb-6 cursor-pointer"
>
          + New Chat
        </button>

        <div className="space-y-2">

          {sessions.length === 0 ? (

            <div className="text-gray-500">
              No Chats
            </div>

          ) : (

            sessions.map((session) => (

              <div
                key={session.id}
               onClick={() => {
  setSessionId(session.id);
  loadConversation(session.id);
}}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  session.id === sessionId
                    ? "bg-blue-500 text-white"
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {session.title}
              </div>

            ))

          )}

        </div>

      </div>

      {/* Chat */}

      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full py-8">

          <h1 className="text-3xl font-bold text-center mb-8">
            🤖 Somesh AI Chat
          </h1>

          <div className="space-y-4 pb-28">

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

        </div>

        {/* Input */}

        <form
          onSubmit={handleSubmit}
          className="border-t p-4"
        >

          <div className="max-w-4xl mx-auto flex gap-2">

            <input
              className="flex-1 border rounded-lg p-3 dark:bg-zinc-900"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-5 rounded-lg"
            >
              Send
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

