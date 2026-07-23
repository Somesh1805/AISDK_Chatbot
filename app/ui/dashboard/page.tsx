"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  title: string;
};

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadSessions() {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data);
    }

    loadSessions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        Chats
      </h1>

      <button
        onClick={() => router.push("/ui/chat-json")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        + New Chat
      </button>

      <div className="space-y-3">

        {sessions.map((session) => (

          <div
            key={session.id}
            onClick={() =>
              router.push(`/ui/chat-json?sessionId=${session.id}`)
            }
            className="border p-4 rounded cursor-pointer hover:bg-zinc-100"
          >
            {session.title}
          </div>

        ))}

      </div>

    </div>
  );
}