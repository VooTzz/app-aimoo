// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("aimoo-user");

    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("aimoo-user");
    router.push("/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Memuat dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Selamat datang, {user.name}!</h1>
        <p className="text-gray-600 mb-6">Email: {user.email}</p>

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => alert("Fitur premium belum tersedia 😅")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Gunakan AimooGPT
          </button>
        </div>
      </div>
    </main>
  );
}
