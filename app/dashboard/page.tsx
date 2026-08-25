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
  subImage?: string;
}

interface NewsForm {
  title: string;
  category: 'berita' | 'artikel' | 'kegiatan';
  content: string;
  excerpt: string;
  image: string;
  subImage: string;
  author: string;
}

export default function Dashboard() {
  const [tab, setTab] = useState<'news' | 'donatur' | 'users' | 'contacts' | 'comments'>('news');
  const [contacts, setContacts] = useState<Array<{_id: string; name: string; email: string; phone?: string; message: string; service?: string; createdAt: string}>>([]);
  const [contactCount, setContactCount] = useState<number>(0);
  const [news, setNews] = useState<News[]>([]);
  const [donaturList, setDonaturList] = useState<Array<{_id: string; namaDonatur: string; kategori: string; bulan: string; tahun: number; nominal: number; createdAt: string}>>([]);
  const [donaturForm, setDonaturForm] = useState({
    namaDonatur: '',
    kategori: 'tetap',
    bulan: '',
    tahun: new Date().getFullYear().toString(),
    nominal: '',
  });
  const [showDonaturForm, setShowDonaturForm] = useState(false);
  const [totalNewsCount, setTotalNewsCount] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [totalDonatur, setTotalDonatur] = useState<number>(0);
  const [totalNominalDonatur, setTotalNominalDonatur] = useState<number>(0);
  const [allComments, setAllComments] = useState<Array<{_id: string; name: string; text: string; createdAt: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NewsForm>({
    title: '',
    category: 'berita',
    content: '',
    excerpt: '',
    image: '',
    subImage: '',
    author: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.replace('/login');
          return;
        }

        const data = await response.json();
        setCurrentUser({ _id: data.data._id, name: data.data.name });
        setFormData((prev) => ({ ...prev, author: data.data.name }));
      } catch {
        router.replace('/login');
        return;
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      fetchContactCount();
      fetchNewsSummary();
      fetchCommentsSummary();
      fetchDonatur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  useEffect(() => {
    if (tab === 'news') {
      fetchNews();
    } else if (tab === 'donatur') {
      fetchDonatur();
    } else if (tab === 'contacts') {
      fetchContacts();
    } else if (tab === 'comments') {
      fetchCommentsSummary();
    }
  }, [tab]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news?mine=true');
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

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
        setContactCount(Array.isArray(data.data) ? data.data.length : 0);
      }
    } catch (err) {
      setError('Gagal mengambil data kontak');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactCount = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setContactCount(data.data.length);
      } else {
        setContactCount(0);
      }
    } catch (err) {
      setContactCount(0);
    }
  };

  const fetchNewsSummary = async () => {
    try {
      const response = await fetch('/api/news/summary?mine=true');
      const data = await response.json();
      if (data.success) {
        setTotalNewsCount(data.data.totalNews);
        setTotalViews(data.data.totalViews);
        setTotalLikes(data.data.totalLikes);
      }
    } catch (err) {
      setTotalNewsCount(0);
      setTotalViews(0);
      setTotalLikes(0);
    }
  };

  const fetchCommentsSummary = async () => {
    try {
      const response = await fetch('/api/comments/summary');
      const data = await response.json();
      if (data.success) {
        setTotalComments(data.data.totalComments);
        setAllComments(data.data.comments);
      }
    } catch (err) {
      setTotalComments(0);
      setAllComments([]);
    }
  };

  const fetchDonatur = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donatur');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const list = data.data;
        setDonaturList(list);
        setTotalDonatur(list.length);
        setTotalNominalDonatur(list.reduce((sum: number, item: any) => sum + Number(item.nominal || 0), 0));
      } else {
        setDonaturList([]);
        setTotalDonatur(0);
        setTotalNominalDonatur(0);
      }
    } catch (err) {
      setDonaturList([]);
      setTotalDonatur(0);
      setTotalNominalDonatur(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonatur = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/donatur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaDonatur: donaturForm.namaDonatur,
          kategori: donaturForm.kategori,
          bulan: donaturForm.bulan,
          tahun: Number(donaturForm.tahun),
          nominal: Number(donaturForm.nominal),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal menambahkan data donatur');
      }

      setSuccess('Data donatur berhasil ditambahkan');
      setDonaturForm({
        namaDonatur: '',
        kategori: 'tetap',
        bulan: '',
        tahun: new Date().getFullYear().toString(),
        nominal: '',
      });
      setShowDonaturForm(false);
      fetchDonatur();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menambahkan donatur');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;
    try {
      setError('');
      setSuccess('');
      const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setSuccess('Pesan berhasil dihapus');
        fetchContacts();
      } else {
        setError(data.message || 'Gagal menghapus pesan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (field: 'image' | 'subImage', file: File | null) => {
    if (!file) return;

    try {
      setError('');
      setSuccess('');

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('field', field);
      if (editingId) {
        uploadFormData.append('newsId', editingId);
      }

      const response = await fetch('/api/news/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Upload gambar gagal');
      }

      setFormData((prev) => ({
        ...prev,
        [field]: data.data.url,
      }));

      setSuccess(
        field === 'image'
          ? 'Gambar utama berhasil diupload ke Cloudinary.'
          : 'Sub image berhasil diupload ke Cloudinary.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupload gambar');
    }
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
          fetchNewsSummary();
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
          fetchNewsSummary();
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
      // Fetch full news data
      fetch(`/api/news/${item._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFormData({
              title: data.data.title,
              category: data.data.category,
              content: data.data.content,
              excerpt: data.data.excerpt,
              image: data.data.image || '',
              subImage: data.data.subImage || '',
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
        fetchNewsSummary();
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
      subImage: '',
      author: currentUser?.name || '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-lg text-gray-700">Memeriksa autentikasi...</div>
      </div>
    );
  }

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

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-6">
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
            onClick={() => setTab('donatur')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'donatur'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              💰 Donatur
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-white">
                {totalDonatur}
              </span>
            </span>
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
          <button
            onClick={() => setTab('contacts')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'contacts'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              ✉️ Kontak Masuk
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white">
                {contactCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => setTab('comments')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'comments'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              💬 Komentar
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                {totalComments}
              </span>
            </span>
          </button>
        </div>

        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Berita & Artikel</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{totalNewsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Kontak Masuk</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{contactCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Views Berita</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{totalViews}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Likes Berita</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{totalLikes}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Komentar</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{totalComments}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Donatur</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{totalDonatur}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Nominal Donatur</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalNominalDonatur)}
            </p>
          </div>
        </div>

        {/* Alerts */}
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

        {/* News Tab */}
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
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Gambar Utama
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('image', e.target.files?.[0] ?? null)}
                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                    </div>

                    <div>
                      <label htmlFor="subImage" className="block text-sm font-medium text-gray-700">
                        Sub Image (opsional)
                      </label>
                      <input
                        type="url"
                        id="subImage"
                        name="subImage"
                        value={formData.subImage}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="https://..."
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('subImage', e.target.files?.[0] ?? null)}
                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
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

        {/* Donatur Tab */}
        {tab === 'donatur' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Daftar Donatur</h2>
              {!showDonaturForm ? (
                <button
                  type="button"
                  onClick={() => setShowDonaturForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Add Donatur
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDonaturForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Batal
                </button>
              )}
            </div>

            {showDonaturForm && (
              <form onSubmit={handleAddDonatur} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Donatur</label>
                    <input
                      type="text"
                      value={donaturForm.namaDonatur}
                      onChange={(e) => setDonaturForm((prev) => ({ ...prev, namaDonatur: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      value={donaturForm.kategori}
                      onChange={(e) => setDonaturForm((prev) => ({ ...prev, kategori: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="tetap">Tetap</option>
                      <option value="kaleng">Kaleng</option>
                      <option value="kotak">Kotak</option>
                      <option value="zakat">Zakat</option>
                      <option value="isidental">Isidental</option>
                      <option value="program">Program</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                    <input
                      type="text"
                      value={donaturForm.bulan}
                      onChange={(e) => setDonaturForm((prev) => ({ ...prev, bulan: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Contoh: Agustus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                    <input
                      type="number"
                      min="2000"
                      value={donaturForm.tahun}
                      onChange={(e) => setDonaturForm((prev) => ({ ...prev, tahun: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="2026"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
                    <input
                      type="number"
                      min="0"
                      value={donaturForm.nominal}
                      onChange={(e) => setDonaturForm((prev) => ({ ...prev, nominal: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="500000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Simpan Donatur
                </button>
              </form>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : donaturList.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Belum ada data donatur</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nama Donatur</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Kategori</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Bulan</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tahun</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nominal</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {donaturList.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.namaDonatur}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold capitalize">
                              {item.kategori}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{item.bulan}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{item.tahun}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.nominal)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
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

        {/* Comments Tab */}
        {tab === 'comments' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold p-6 border-b">Daftar Komentar</h2>
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : allComments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Belum ada komentar</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nama</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Komentar</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allComments.map((comment) => (
                      <tr key={comment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">{comment.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{comment.text}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {tab === 'contacts' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Daftar Kontak Masuk</h2>
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Belum ada pesan masuk</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nama</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Telepon</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Layanan</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Pesan</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tanggal</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {contacts.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.service || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{c.message}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(c.createdAt).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => handleDeleteContact(c._id)}
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
        )}

        {/* Users Tab */}
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
