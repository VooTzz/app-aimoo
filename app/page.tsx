// app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-blue-100">
      {/* LOGO */}
      <Image src="/logo.png" alt="AimooGPT Logo" width={80} height={80} className="mb-4" />

      {/* JUDUL */}
      <h1 className="text-4xl font-bold mb-2">Selamat Datang di <span className="text-blue-600">AimooGPT</span></h1>
      <p className="text-lg text-gray-600 mb-6">
        Chat AI cerdas untuk semua. Gratis & Premium tersedia.
      </p>

      {/* TOMBOL */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/chat"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Mulai Chat
        </Link>
        <Link
          href="/register"
          className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
        >
          Daftar Sekarang
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 text-sm text-gray-500">
        &copy; 2025 AimooGPT. Semua Hak Dilindungi.
      </footer>
    </main>
  );
}
