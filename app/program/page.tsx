'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define a type for Donation for better type safety
interface Donation {
  _id: string;
  orderId: string;
  donorName: string;
  amount: number;
  status: string;
  createdAt: string; // Or Date if you parse it
}

export default function ProgramPage() {
  // Data copywriting dinamis
  const programData = {
    title: "Sedekah Anda, Cahaya Bagi Sesama.",
    date: "10 Juni 2024",
    author: "Tim Relawan Yayasan",
    paragraphs: [
      "Hari ini, ribuan anak yatim dan keluarga prasejahtera berjuang untuk kebutuhan pokok.",
      "Uluran tangan Anda bukan sekadar nominal, tapi harapan baru bagi mereka untuk melihat hari esok dengan senyuman.",
      "Mari bergabung dalam gerakan kebaikan ini untuk menciptakan dampak nyata."
    ]
  };

  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donors, setDonors] = useState<Donation[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDonors = async () => {
    setFetchError(null);
    try {
      const response = await fetch('/api/donations');
      if (response.ok) {
        const data = await response.json();
        setDonors(data);
      } else {
        setFetchError("Gagal mengambil data donatur dari server.");
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      setFetchError("Terjadi kesalahan koneksi saat memuat data donatur.");
    }
  };

  useEffect(() => {
    fetchDonors();
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;

    let script = document.createElement('script');
    script.src = midtransScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) return alert("Mohon lengkapi data.");
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, amount: parseInt(amount) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error("Gagal mendapatkan token pembayaran. Pastikan API berjalan.");
      }

      const data = await response.json();
      if (data.token) {
        (window as any).snap.pay(data.token, {
          onSuccess: () => {
            alert("Terima kasih! Donasi Anda telah kami terima.");
            fetchDonors(); // Perbarui daftar setelah sukses
          },
          onPending: () => alert("Menunggu penyelesaian pembayaran."),
          onError: () => alert("Maaf, terjadi kesalahan pada transaksi."),
        });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan sistem");
      console.error("Payment Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar Simple */}
      <nav className="p-6 bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-red-600">Yayasan Al-Ishlah</Link>
          <Link href="/" className="text-gray-600 hover:text-red-600">Kembali ke Beranda</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Copywriting Section */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
            Program Kemanusiaan 2024
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {programData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📅 {programData.date}</span>
              <span>✍️ Oleh {programData.author}</span>
            </div>
          </div>

          <div className="space-y-4">
            {programData.paragraphs.map((text, idx) => (
              <p key={idx} className="text-xl text-gray-600 leading-relaxed">
                {text}
              </p>
            ))}
          </div>

          <div className="space-y-4">
            {[
              "Penyaluran 100% Amanah & Transparan",
              "Laporan penyaluran dikirim rutin via email",
              "Membantu pendidikan, kesehatan, dan pangan"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500">✔</span> {text}
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-red-100 border border-gray-100">
          <h3 className="text-2xl font-bold text-center mb-8">Isi Form Donasi</h3>
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap Donatur</label>
              <input
                type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="Contoh: Hamba Allah" required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal Donasi (IDR)</label>
              <input
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-2xl font-bold text-red-600"
                placeholder="0" required
              />
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Donasi Sekarang"}
            </button>
          </form>
        </div>
      </div>

      {/* Donor List Section */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 italic">"Jazakumullah Khairan Katsiran"</h2>
          <p className="text-gray-600 mt-2 text-lg">Terima kasih atas ketulusan hati para donatur yang telah berbagi kebaikan.</p>
        </div>

        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {fetchError}</span>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50/50">
                  <th className="px-8 py-5 text-sm font-bold text-red-900 uppercase tracking-wider">Donatur</th>
                  <th className="px-8 py-5 text-sm font-bold text-red-900 uppercase tracking-wider">Tanggal</th>
                  <th className="px-8 py-5 text-sm font-bold text-red-900 uppercase tracking-wider">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donors.length > 0 ? (
                  donors.map((donor) => (
                    <tr key={donor._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-gray-900 font-medium">{donor.donorName}</td>
                      <td className="px-8 py-5 text-gray-600">
                        {new Date(donor.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-5 text-red-600 font-bold">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(donor.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-400 italic"> 
                      {fetchError ? "Gagal memuat data donatur." : "Belum ada data donatur saat ini."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}