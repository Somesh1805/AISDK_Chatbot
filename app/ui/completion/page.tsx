"use client";

import { useState } from "react";

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setPrompt("");
    setError(null);

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setCompletion(data.text);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-12 px-4">

      <h1 className="text-3xl font-bold mb-6">
        AI Completion Demo
      </h1>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="whitespace-pre-wrap border rounded-lg p-4 bg-gray-100 dark:bg-zinc-900">
          Loading...
        </div>
      ) : completion ? (
        <div className="whitespace-pre-wrap border rounded-lg p-4 bg-gray-100 dark:bg-zinc-900 mb-4">
          {completion}
        </div>
      ) : null}

      <form onSubmit={complete}>
        <div className="flex gap-2">

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How can I help you?"
            className="flex-1 p-3 border rounded-lg dark:bg-zinc-800"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 rounded-lg disabled:opacity-50"
          >
            Send
          </button>

        </div>
      </form>

    </div>
  );
}