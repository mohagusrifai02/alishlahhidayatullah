'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface News {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  views?: number;
  likesCount?: number;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchNews();
    fetchLikesSummary();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'semua' 
        ? '/api/news'
        : `/api/news?category=${selectedCategory}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikesSummary = async () => {
    try {
      const response = await fetch('/api/likes/summary');
      const data = await response.json();
      if (data.success) {
        setLikesMap(data.data);
      }
    } catch (error) {
      console.error('Error fetching likes summary:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12 scroll-reveal scroll-reveal-delay-100">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-white hover:text-red-200 transition">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-bold mb-2">Artikel dan Kegiatan kami</h1>
          <p className="text-red-100">Informasi terkini dari Sekolah</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap scroll-reveal scroll-reveal-delay-200">
          {['semua', 'berita', 'artikel', 'kegiatan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Tidak ada berita dalam kategori ini</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {news.map((item, index) => (
              <Link key={item._id} href={`/kegiatan/${item._id}`}>
                <div
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer scroll-reveal"
                  style={{ transitionDelay: `${index * 70 + 220}ms` }}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full mb-3">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-xl text-gray-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {item.excerpt}
                    </p>
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                      <span className="text-gray-500 text-sm">
                        {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                      </span>
                      <div className="flex gap-3 text-gray-500 text-sm">
                        <span>👁️ {item.views ?? 0}</span>
                        <span>❤️ {likesMap[item._id] ?? 0}</span>
                      </div>
                      <div className="text-red-700 font-semibold">
                        Baca Selengkapnya →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

       {/* Footer */}
      <footer id="kontak" className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6"> 
                <Image
                  src="/logo.jpeg"
                  alt="Yayasan Al-Ishlah Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold tracking-tight text-blue-900">Yayasan Al-Ishlah</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Jl. Jali timur, Dampyak Kab. Tegal, Indonesia 52461
              </p>
              <div className="flex gap-4 mt-6">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:text-blue-600 cursor-pointer">IG</div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:text-blue-600 cursor-pointer">FB</div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:text-blue-600 cursor-pointer">YT</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 uppercase text-sm tracking-widest">Tautan Cepat</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition">Beranda</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Program</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Kegiatan</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 uppercase text-sm tracking-widest">Kontak</h4>
              <ul className="space-y-4 text-slate-500">
                <li className="flex items-center gap-3">
                  <span>📧</span> info@al-ishlah.sch.id
                </li>
                <li className="flex items-center gap-3">
                  <span>📞</span> (021) 1234-5678
                </li>
                <li className="flex items-center gap-3">
                  <span>💬</span> +62 812-3456-7890
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 uppercase text-sm tracking-widest">Jam Operasional</h4>
              <ul className="space-y-2 text-slate-500">
                <li className="flex justify-between"><span>Senin - Jumat</span> <span>07.00 - 15.00</span></li>
                <li className="flex justify-between"><span>Sabtu</span> <span>08.00 - 12.00</span></li>
                <li className="flex justify-between text-red-400"><span>Minggu</span> <span>Tutup</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Yayasan Al-Ishlah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
