import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Silakan masukkan nama'],
      minlength: [3, 'Nama minimal 3 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Silakan masukkan email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Silakan masukkan email yang valid'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Silakan masukkan nomor telepon'],
    },
    address: {
      type: String,
      required: [true, 'Silakan masukkan alamat'],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
