import { NextRequest, NextResponse } from 'next/server';

const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const USERS_FILE = 'users.json';

async function getUsers() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${USERS_FILE}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw',
    },
  });
  const json = await res.json();
  return Array.isArray(json) ? json : JSON.parse(json);
}

async function updateUsers(users: any[]) {
  const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${USERS_FILE}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });
  const { sha } = await getRes.json();

  await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${USERS_FILE}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: 'Update usage count',
      content: Buffer.from(JSON.stringify(users, null, 2)).toString('base64'),
      sha,
    }),
  });
}

function getToday() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userEmail = req.cookies.get('email')?.value;

  if (!userEmail) {
    return NextResponse.json({ error: 'User not logged in.' }, { status: 401 });
  }

  const users = await getUsers();
  const userIndex = users.findIndex((u: any) => u.email === userEmail);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not registered.' }, { status: 403 });
  }

  const user = users[userIndex];
  const today = getToday();

  if (user.plan === 'free') {
    if (!user.usage || user.usage.date !== today) {
      user.usage = { date: today, count: 0 };
    }

    if (user.usage.count >= 5) {
      return NextResponse.json({ error: 'Free usage limit reached for today.' }, { status: 429 });
    }

    user.usage.count += 1;
    users[userIndex] = user;
    await updateUsers(users);
  }

  // Kirim ke OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: body.messages,
    }),
  });

  const result = await response.json();
  return NextResponse.json(result);
}
