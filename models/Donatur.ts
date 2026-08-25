import mongoose from 'mongoose';

export interface IDonatur {
  _id?: string;
  namaDonatur: string;
  kategori: 'tetap' | 'kaleng' | 'kotak' | 'zakat' | 'isidental' | 'program';
  bulan: string;
  tahun: number;
  nominal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const donaturSchema = new mongoose.Schema<IDonatur>(
  {
    namaDonatur: {
      type: String,
      required: [true, 'Nama donatur wajib diisi'],
      trim: true,
    },
    kategori: {
      type: String,
      enum: ['tetap', 'kaleng', 'kotak', 'zakat', 'isidental', 'program'],
      required: [true, 'Kategori wajib diisi'],
      lowercase: true,
      trim: true,
    },
    bulan: {
      type: String,
      required: [true, 'Bulan wajib diisi'],
      trim: true,
    },
    tahun: {
      type: Number,
      default: () => new Date().getFullYear(),
      min: [2000, 'Tahun minimal 2000'],
    },
    nominal: {
      type: Number,
      required: [true, 'Nominal wajib diisi'],
      min: [0, 'Nominal minimal 0'],
    },
  },
  {
    timestamps: true,
  }
);

const Donatur = mongoose.models.Donatur || mongoose.model('Donatur', donaturSchema);

export default Donatur;
