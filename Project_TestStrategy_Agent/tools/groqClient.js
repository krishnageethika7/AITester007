const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama-3.3-70b-versatile';

export async function groqChat({ groqKey, system, user, maxTokens = 8192, retries = 1 }) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user',   content: user },
        ],
        temperature: 0.3,
        max_tokens:  maxTokens,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices[0].message.content;
    }

    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }
    throw new Error(`GROQ error ${res.status}: ${await res.text()}`);
  }
}
