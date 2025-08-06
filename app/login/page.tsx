// app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUsersFromGitHub } from "@/lib/github";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const users = await fetchUsersFromGitHub();

      const foundUser = users.find(
        (u: any) => u.email === form.email && u.password === form.password
      );

      if (!foundUser) {
        setMessage("Email atau password salah.");
        setLoading(false);
        return;
      }

      // Simpan ke localStorage sebagai sesi sederhana
      localStorage.setItem("aimoo-user", JSON.stringify(foundUser));
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("aimoo-user");
    if (user) router.push("/dashboard");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login AimooGPT</h1>

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
          {loading ? "Melakukan login..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <p className="mt-6 text-center text-sm">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </form>
    </main>
  );
}
