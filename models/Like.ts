import mongoose from 'mongoose';

export interface ILike {
  _id?: string;
  newsId: mongoose.Schema.Types.ObjectId;
  ipAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const likeSchema = new mongoose.Schema<ILike>(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index untuk prevent duplicate likes dari same IP untuk same news
likeSchema.index({ newsId: 1, ipAddress: 1 }, { unique: true });

export const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
