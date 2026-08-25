'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DonaturItem {
  _id: string;
  namaDonatur: string;
  kategori: string;
  bulan: string;
  tahun?: number;
  nominal: number;
  createdAt?: string;
}

export default function DermawanPage() {
  const [donaturList, setDonaturList] = useState<DonaturItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonatur = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/donatur');
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Gagal memuat data dermawan');
        }

        setDonaturList(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data dermawan');
        setDonaturList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonatur();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Kembali ke Beranda
        </Link>

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Yayasan Al-Ishlah</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Daftar Dermawan</h1>
          <p className="mt-3 text-slate-600">Terima kasih atas kepedulian dan partisipasi para dermawan dalam mendukung program sosial.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-500">Memuat data dermawan...</p>
          </div>
        ) : donaturList.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-500">Belum ada data dermawan.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nama</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Kategori</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Bulan</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tahun</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {donaturList.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.namaDonatur}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold capitalize text-amber-800">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{item.bulan}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{item.tahun ?? new Date(item.createdAt ?? Date.now()).getFullYear()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-700">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(item.nominal || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
