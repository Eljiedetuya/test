const fetch = require('node-fetch')


exports.handler = async function(event, context) {
try{
if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }


const body = JSON.parse(event.body || '{}')
const messages = body.messages || []


// Build a helpful system prompt that contains your personal 'facts' so the assistant can answer about you.
// IMPORTANT: Edit the `PERSONAL_KB` string below with factual information about yourself.
const PERSONAL_KB = `Name: John Miguel Santos
Title: Frontend Developer & UI/UX Enthusiast
Skills: React, JavaScript, TypeScript, TailwindCSS, Node.js, UI Design, UX Research
Location: Manila, Philippines
Bio: I’m a passionate frontend developer who focuses on building beautiful, functional, and user-centered web applications. I enjoy crafting smooth UI experiences, optimizing performance, and translating ideas into clean code. I’ve worked on personal projects, freelancing work, and open-source contributions. Outside of coding, I love design, photography, and continuous learning.
Projects:
- Portfolio Website: A personal portfolio built with React and TailwindCSS.
- TaskFlow App: A productivity and task management web app using React + Firebase.
- UI Component Library: A small reusable UI kit designed in Figma and implemented in React.

Social Links:
GitHub: https://github.com/jm-santos
LinkedIn: https://linkedin.com/in/jm-santos
Portfolio: https://jm-santos.dev
`


const prompt = `You are an assistant that answers visitor questions specifically about the portfolio owner. Use the personal facts below to ground your answers. If the visitor asks for opinions or generic topics, answer naturally.\n\nPersonal facts:\n${PERSONAL_KB}\n\nConversation:\n` + messages.map(m => `${m.role}: ${m.text}`).join('\n') + '\nAssistant:'


const API_KEY = process.env.GEMINI_API_KEY
if(!API_KEY) return { statusCode: 500, body: 'GEMINI_API_KEY not configured' }


// Example: call the Gemini REST completions endpoint
const res = await fetch('https://api.generativeai.google/v1beta2/models/text-bison-001:generate', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${API_KEY}`
},
body: JSON.stringify({
prompt: {text: prompt},
maxOutputTokens: 450
})
})


const data = await res.json()
const reply = (data?.candidates?.[0]?.content) || data?.output?.[0]?.content || JSON.stringify(data)


return { statusCode: 200, body: JSON.stringify({ reply }) }
}catch(err){
console.error(err)
return { statusCode: 500, body: 'Internal error' }
}
}