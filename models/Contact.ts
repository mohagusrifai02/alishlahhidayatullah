import mongoose from 'mongoose';

export interface IContact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactSchema = new mongoose.Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Silakan masukkan nama'],
      minlength: [2, 'Nama minimal 2 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Silakan masukkan email'],
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: [true, 'Silakan masukkan pesan'],
    },
    service: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
