import mongoose from 'mongoose';

export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete (ret as Partial<IAdmin>).password;
        return ret;
      },
    },
  }
);

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
