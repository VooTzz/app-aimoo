// app/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUserToGitHub } from "@/lib/github"; // Panggil fungsi dari lib/github.ts

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!form.name || !form.email || !form.password) {
        setMessage("Mohon lengkapi semua field.");
        setLoading(false);
        return;
      }

      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
        plan: "free",       // default: akun gratis
        limitLeft: 5        // jatah awal chat untuk user gratis
      };

      await addUserToGitHub(newUser);
      setMessage("Berhasil daftar! Silakan login.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Gagal daftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Daftar AimooGPT</h1>

        <label className="block mb-2 font-medium">Nama</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-6 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}

        <p className="mt-6 text-center text-sm">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login di sini
          </a>
        </p>
      </form>
    </main>
  );
  }
