import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donatur from '@/models/Donatur';

const KATEGORI_DONATUR = ['tetap', 'kaleng', 'kotak', 'zakat', 'isidental', 'program'];

export async function GET() {
  try {
    await dbConnect();

    const data = await Donatur.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const namaDonatur = String(body?.namaDonatur ?? body?.nama_donatur ?? '').trim();
    const rawKategori = String(body?.kategori ?? '').trim().toLowerCase();
    const bulan = String(body?.bulan ?? '').trim();
    const tahun = Number(body?.tahun ?? new Date().getFullYear());
    const nominal = Number(body?.nominal ?? body?.amount ?? 0);

    const kategori = rawKategori === 'insidental' ? 'isidental' : rawKategori;

    if (!namaDonatur) {
      return NextResponse.json(
        { success: false, message: 'Nama donatur wajib diisi' },
        { status: 400 }
      );
    }

    if (!KATEGORI_DONATUR.includes(kategori)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Kategori tidak valid. Pilihan: tetap, kaleng, kotak, zakat, isidental, program',
        },
        { status: 400 }
      );
    }

    if (!bulan) {
      return NextResponse.json(
        { success: false, message: 'Bulan wajib diisi' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(tahun) || tahun < 2000) {
      return NextResponse.json(
        { success: false, message: 'Tahun wajib diisi dan minimal 2000' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(nominal) || nominal <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nominal harus berupa angka dan lebih dari 0' },
        { status: 400 }
      );
    }

    const donatur = await Donatur.create({
      namaDonatur,
      kategori,
      bulan,
      tahun,
      nominal,
    });

    return NextResponse.json(
      {
        success: true,
        data: donatur,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Server error',
      },
      { status: 400 }
    );
  }
}
