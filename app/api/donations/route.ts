import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';

export async function GET() {
  try {
    await dbConnect();
    // Mengambil 10 donasi terbaru, diurutkan dari yang paling baru
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .limit(10);
      
    return NextResponse.json(donations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}