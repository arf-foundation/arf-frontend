import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Lazy‑load OpenAI client only when the API is called (avoids build‑time key requirement)
let openai: any = null;
async function getOpenAI() {
  if (!openai) {
    const { default: OpenAI } = await import('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Read system prompt from file (this is fine – it’s static content)
const SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), 'app/api/chat/prompt.txt'),
  'utf-8'
);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const openai = await getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      response_format: { type: 'json_object' }
    });

    const jsonOutput = completion.choices[0].message.content;
    const parsed = JSON.parse(jsonOutput);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 });
  }
}
