'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/VooTzz/MINO-AI/main/users.json`
      );
      const users = await res.json();

      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        // Simpan sesi (simulasi login)
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/chat');
      } else {
        setError('Username atau password salah');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal login. Coba lagi nanti.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login AimooGpt</h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="border rounded w-full py-2 px-3 mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border rounded w-full py-2 px-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </form>
    </div>
  );
}
