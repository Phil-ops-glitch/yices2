import { useState } from "react";

export function useAI(apiKey: string) {
  const [loading, setLoading] = useState(false);

  const call = async (system: string, user: string): Promise<string> => {
    if (!apiKey) return "No API key set. Go to Settings → enter your Anthropic API key.";
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      const d = await res.json();
      if (!res.ok) return d.error?.message || "AI error.";
      return d.content?.map((b: { text?: string }) => b.text || "").join("") || "No response.";
    } catch { return "AI temporarily unavailable. Check your connection."; }
    finally { setLoading(false); }
  };

  return { call, loading };
}
