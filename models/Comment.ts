import mongoose from 'mongoose';

export interface IComment {
  _id?: string;
  newsId: mongoose.Schema.Types.ObjectId;
  name: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Silakan masukkan nama'],
      minlength: [2, 'Nama minimal 2 karakter'],
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },
    text: {
      type: String,
      required: [true, 'Silakan masukkan komentar'],
      minlength: [5, 'Komentar minimal 5 karakter'],
      maxlength: [1000, 'Komentar maksimal 1000 karakter'],
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
