import { NextResponse } from 'next/server';
// @ts-ignore
import * as midtransClient from 'midtrans-client';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';

export async function POST(request: Request) {
  try {
    // Cek apakah API Key sudah ada di .env.local
    if (!process.env.MIDTRANS_SERVER_KEY) {
      return NextResponse.json({ error: "Server Key Midtrans belum diatur" }, { status: 500 });
    }

    const snap = new (midtransClient as any).Snap({
      isProduction: false, 
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    await dbConnect();
    const { donorName, amount } = await request.json();
    
    // Buat Order ID unik
    const orderId = `DONASI-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: donorName,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Simpan data awal ke MongoDB
    await Donation.create({
      orderId: orderId,
      donorName: donorName,
      amount: amount,
      status: 'pending'
    });

    // Mengembalikan Snap Token
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
