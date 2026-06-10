'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

interface News {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  views: number;
}

interface Comment {
  _id: string;
  name: string;
  text: string;
  createdAt: string;
}

export default function NewsDetail() {
  const params = useParams();
  const id = params.id as string;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    if (id) {
      fetchNews();
      fetchLikes();
      fetchComments();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${id}`);
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
        if (!hasIncrementedRef.current) {
          hasIncrementedRef.current = true;
          await incrementViews();
        }
      } else {
        setError('Berita tidak ditemukan');
      }
    } catch (err) {
      setError('Error loading news');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      const response = await fetch(`/api/news/${id}/view`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setNews((current) =>
          current ? { ...current, views: data.data.views } : current
        );
      }
    } catch (err) {
      console.error('Gagal mencatat views:', err);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/news/${id}/like`);
      const data = await response.json();
      if (data.success) {
        setLikesCount(data.data.likesCount);
        setIsLiked(data.data.isLiked);
      }
    } catch (err) {
      console.error('Gagal mengambil likes:', err);
    }
  };

  const handleToggleLike = async () => {
    try {
      setLikeLoading(true);
      const response = await fetch(`/api/news/${id}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setLikesCount(data.data.likesCount);
        setIsLiked(data.data.isLiked);
      }
    } catch (err) {
      console.error('Gagal toggle like:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/news/${id}/comments`);
      const data = await response.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil komentar:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');
    setCommentSuccess('');

    if (!commentForm.name.trim() || !commentForm.text.trim()) {
      setCommentError('Nama dan komentar harus diisi');
      return;
    }

    try {
      setCommentLoading(true);
      const response = await fetch(`/api/news/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm),
      });
      const data = await response.json();
      if (data.success) {
        setCommentSuccess('Komentar berhasil ditambahkan');
        setCommentForm({ name: '', text: '' });
        await fetchComments();
        setTimeout(() => setCommentSuccess(''), 3000);
      } else {
        setCommentError(data.message || 'Gagal menambahkan komentar');
      }
    } catch (err) {
      setCommentError('Terjadi kesalahan saat menambahkan komentar');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/news" className="text-red-700 hover:text-red-800">
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 scroll-reveal scroll-reveal-delay-100">
        <Link href="/kegiatan" className="text-red-700 hover:text-red-800 mb-6 inline-block">
          ← Kembali ke Kegiatan
        </Link>

        <article>
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full mb-4">
              {news.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{news.title}</h1>
            <div className="flex gap-6 flex-wrap text-gray-600 text-sm">
              <span>📝 {news.author}</span>
              <span>📅 {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>👁️ {news.views ?? 0} kali dilihat</span>
            </div>
          </div>

          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="prose prose-red max-w-full mb-12">
            <p className="text-lg text-gray-700 mb-6">{news.excerpt}</p>
            <div className="text-gray-700 whitespace-pre-wrap break-words">
              {news.content}
            </div>
          </div>

          {/* Like & Share Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleToggleLike}
                disabled={likeLoading}
                className={`px-4 py-2 rounded font-semibold transition ${
                  isLiked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } disabled:opacity-50`}
              >
                ❤️ {likesCount} {likesCount === 1 ? 'Suka' : 'Suka'}
              </button>
              <Link href='/program' className="px-4 py-2 rounded font-semibold transition bg-gray-200 text-gray-800 hover:bg-gray-300">Donasi yuk!</Link>
            </div>

            <h3 className="font-semibold text-gray-800 mb-4">Bagikan Artikel Ini</h3>
            <div className="flex gap-4">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}`} 
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">
                Twitter
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Facebook
              </a>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Komentar ({comments.length})</h3>

            {/* Comment Form */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Tambahkan Komentar</h4>
              {commentError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {commentError}
                </div>
              )}
              {commentSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {commentSuccess}
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                  <textarea
                    value={commentForm.text}
                    onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                    placeholder="Tulis komentar Anda di sini..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={commentLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {commentLoading ? 'Mengirim...' : 'Kirim Komentar'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-800">{comment.name}</h5>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Yayasan Al-Ishlah</h3>
            <p className="text-red-100">
              Official website of Yayasan Al-Ishlah, dedicated to empowering communities through education, health, and humanitarian programs. Join us in making a difference!
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Menu Utama</h4>
            <ul className="space-y-2 text-red-100">
              <li><Link href="/" className="hover:text-white">Beranda</Link></li>
              <li><Link href="/program" className="hover:text-white">Program</Link></li>
              <li><Link href="/kegiatan" className="hover:text-white">Kegiatan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <p className="text-red-100 mb-2">📍 Tegal, Jawa Tengah</p>
            <p className="text-red-100 mb-2">📞 +6289516589293</p>
            <p className="text-red-100">📧 info@alishlah.tegal</p>
          </div>
        </div>
        <div className="border-t border-red-800 mt-8 pt-8 text-center text-red-100">
          <p>&copy; 2026 Yayasan Al-Ishlah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
