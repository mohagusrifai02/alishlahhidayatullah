import dbConnect from '@/lib/mongodb';
import { News } from '@/models/News';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID tidak valid',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const news = await News.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: 'Berita tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    );
  }
}
