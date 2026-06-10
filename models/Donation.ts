import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, success, failure
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);