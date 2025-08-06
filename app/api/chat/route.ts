import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // atau 'gpt-3.5-turbo' kalau versi gratis
      messages: messages,
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mendapatkan respon dari OpenAI' }, { status: 500 });
  }
}
