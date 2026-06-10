'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface News {
  _id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
}

interface NewsForm {
  title: string;
  category: 'berita' | 'artikel' | 'kegiatan';
  content: string;
  excerpt: string;
  image: string;
  author: string;
}

export default function DashboardClient() {
  const [tab, setTab] = useState<'news' | 'users'>('news');
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NewsForm>({
    title: '',
    category: 'berita',
    content: '',
    excerpt: '',
    image: '',
    author: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  useEffect(() => {
    if (tab === 'news') {
      fetchNews();
    }
  }, [tab]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (err) {
      setError('Gagal mengambil data berita');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        const response = await fetch(`/api/news/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          setSuccess('Berita berhasil diperbarui');
          fetchNews();
          resetForm();
        } else {
          setError(data.message || 'Gagal memperbarui berita');
        }
      } else {
        const response = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          setSuccess('Berita berhasil ditambahkan');
          fetchNews();
          resetForm();
        } else {
          setError(data.message || 'Gagal menambahkan berita');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = (item: News) => {
    const newsItem = news.find(n => n._id === item._id);
    if (newsItem) {
      setEditingId(item._id);
      fetch(`/api/news/${item._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFormData({
              title: data.data.title,
              category: data.data.category,
              content: data.data.content,
              excerpt: data.data.excerpt,
              image: data.data.image,
              author: data.data.author,
            });
          }
        });
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Berita berhasil dihapus');
        fetchNews();
      } else {
        setError(data.message || 'Gagal menghapus berita');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'berita',
      content: '',
      excerpt: '',
      image: '',
      author: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ← Kembali ke Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('news')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'news'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            📰 Kelola Berita & Artikel
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'users'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            👥 Manajemen User
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {tab === 'news' && (
          <div>
            <div className="mb-6">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Tambah Berita Baru
                </button>
              ) : (
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Batal
                </button>
              )}
            </div>

            {showForm && (
              <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">
                  {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Judul
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Kategori
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="berita">Berita</option>
                        <option value="artikel">Artikel</option>
                        <option value="kegiatan">Kegiatan</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                        Penulis
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                      Ringkasan / Preview
                    </label>
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      URL Gambar
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Konten Lengkap
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingId ? 'Update Berita' : 'Tambah Berita'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-2xl font-semibold p-6 border-b">Daftar Berita & Artikel</h2>

              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : news.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Belum ada berita</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Judul</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Kategori</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Penulis</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {news.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.title}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.author}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-4">Mengelola User - Fitur user management sudah tersedia sebelumnya</p>
            <Link href="/dashboard/users" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Ke Halaman User Management →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
