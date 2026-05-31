import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type OpenAI from 'openai';

let openai: OpenAI | null = null;

async function getOpenAI(): Promise<OpenAI> {
  if (!openai) {
    const { default: OpenAIConstructor } = await import('openai');
    openai = new OpenAIConstructor({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

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
