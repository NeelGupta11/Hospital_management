'use client'

import { useState } from 'react';

export default function GeminiComponent() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputPrompt) return;

    setIsLoading(true);
    setGeminiResponse('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setGeminiResponse(data.output);
    } catch (error) {
      console.error('Failed to fetch from API:', error);
      setGeminiResponse('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
  <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Ask <span className="text-indigo-600">HOSPIAI</span> Anything to do✨
    </h1>

    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={inputPrompt}
        onChange={(e) => setInputPrompt(e.target.value)}
        placeholder="Type your question here..."
        disabled={isLoading}
        className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isLoading ? "Generating..." : "Generate"}
      </button>
    </form>

    {geminiResponse && (
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
        <p className="font-semibold text-gray-700 mb-3">Response:</p>
        <pre className="whitespace-pre-wrap text-gray-800 text-sm font-mono">
          {geminiResponse}
        </pre>
      </div>
    )}
  </div>
</div>

  );
}