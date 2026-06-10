import dbConnect from '@/lib/mongodb';
import { Comment } from '@/models/Comment';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

export async function GET(
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
    const newsId = new Types.ObjectId(id);

    const comments = await Comment.find({ newsId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: comments,
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
    const newsId = new Types.ObjectId(id);
    const body = await request.json();

    if (!body.name || !body.text) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama dan komentar harus diisi',
        },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      newsId,
      name: body.name.trim(),
      text: body.text.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        data: comment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server error',
      },
      { status: 400 }
    );
  }
}
