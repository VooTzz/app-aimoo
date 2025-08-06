// lib/github.ts
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const USERS_FILE = "users.json";

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

export async function readUsersFromGitHub(): Promise<any[]> {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${USERS_FILE}`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Gagal membaca data user dari GitHub");

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString();
  return JSON.parse(content);
}

export async function addUserToGitHub(newUser: any) {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${USERS_FILE}`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Gagal mengambil file user");

  const data = await res.json();
  const sha = data.sha;
  const users = JSON.parse(Buffer.from(data.content, "base64").toString());

  const exists = users.find((u: any) => u.email === newUser.email);
  if (exists) throw new Error("Email sudah terdaftar");

  users.push(newUser);

  const updatedContent = Buffer.from(JSON.stringify(users, null, 2)).toString("base64");

  const updateRes = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Menambahkan user: ${newUser.email}`,
      content: updatedContent,
      sha,
    }),
  });

  if (!updateRes.ok) throw new Error("Gagal update file users.json");
}
