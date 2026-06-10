import mongoose from 'mongoose';

export interface INews {
  _id?: string;
  title: string;
  slug: string;
  category: 'berita' | 'artikel' | 'kegiatan';
  content: string;
  excerpt: string;
  image: string;
  author: string;
  authorId?: string;
  publishedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
}

const newsSchema = new mongoose.Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'Silakan masukkan judul'],
      minlength: [5, 'Judul minimal 5 karakter'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['berita', 'artikel', 'kegiatan'],
      default: 'berita',
    },
    content: {
      type: String,
      required: [true, 'Silakan masukkan konten'],
    },
    excerpt: {
      type: String,
      required: [true, 'Silakan masukkan ringkasan'],
    },
    image: {
      type: String,
      required: [true, 'Silakan masukkan URL gambar'],
    },
    author: {
      type: String,
      required: [true, 'Silakan masukkan nama penulis'],
    },
    authorId: {
      type: String,
      required: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const News = mongoose.models.News || mongoose.model('News', newsSchema);
