'use client';

import { useEffect, useState } from 'react';

export default function PaymentPage() {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap Script
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;

    let script = document.createElement('script');
    script.src = midtransScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) {
      alert("Mohon isi nama dan nominal donasi.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Panggil API internal kita untuk mendapatkan token
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, amount: parseInt(amount) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error("Gagal mendapatkan token pembayaran. Pastikan MONGODB_URI di .env.local sudah benar.");
      }

      const data = await response.json();

      if (data.token) {
        // 2. Jalankan pop-up pembayaran Snap
        (window as any).snap.pay(data.token, {
          onSuccess: function (result: any) {
            alert("Pembayaran Berhasil!");
            console.log(result);
          },
          onPending: function (result: any) {
            alert("Menunggu Pembayaran...");
            console.log(result);
          },
          onError: function (result: any) {
            alert("Pembayaran Gagal!");
            console.log(result);
          },
          onClose: function () {
            alert('Anda menutup pop-up sebelum menyelesaikan pembayaran');
          },
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-gray-800">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">Form Donasi</h1>
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Donatur</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Nama lengkap Anda"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nominal Donasi (IDR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: 100000"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}
