// src/lib/gemini.ts

export const generateJournalEntry = async (prompt: string): Promise<string> => {
    const res = await fetch("/api/generate-journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to generate journal entry");
    }
  
    const data = await res.json();
    return data.result;
  };
  