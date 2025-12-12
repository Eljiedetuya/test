// Use .mjs for ESM or add "type": "module" in package.json
export async function handler(event, context) {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body || '{}');
    const messages = body.messages || [];

    // Personal facts for the AI to answer questions about you
    const PERSONAL_KB = `
Name: John Miguel Santos
Title: Frontend Developer & UI/UX Enthusiast
Skills: React, JavaScript, TypeScript, TailwindCSS, Node.js, UI Design, UX Research
Location: Manila, Philippines
Bio: I’m a passionate frontend developer who builds beautiful, functional web apps and contributes to open-source projects.
Projects:
- Portfolio Website
- TaskFlow App
Social Links:
GitHub: https://github.com/jm-santos
LinkedIn: https://linkedin.com/in/jm-santos
Portfolio: https://jm-santos.dev
`;

    // Build prompt for Gemini API
    const prompt = `You are an assistant that answers visitor questions specifically about the portfolio owner. Use the personal facts below to ground your answers.\n\nPersonal facts:\n${PERSONAL_KB}\n\nConversation:\n` +
      messages.map(m => `${m.role}: ${m.text}`).join('\n') +
      '\nAssistant:';

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return { statusCode: 500, body: 'GEMINI_API_KEY not configured' };

    // Node 18+ has global fetch; no need to import node-fetch
    const res = await fetch('https://api.generativeai.google/v1beta2/models/text-bison-001:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        maxOutputTokens: 450
      })
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content || 'Sorry, I could not generate a response.';

    return { statusCode: 200, body: JSON.stringify({ reply }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Internal error' };
  }
}
