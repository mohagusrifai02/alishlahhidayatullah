import dbConnect from '@/lib/mongodb';
import { News } from '@/models/News';
import { Admin } from '@/models/Admin';
import { getAuthPayload } from '@/lib/auth';
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
    const news = await News.findById(id);

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

export async function PUT(
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

    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const existingNews = await News.findById(id);
    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          message: 'Berita tidak ditemukan',
        },
        { status: 404 }
      );
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const ownsNews = existingNews.authorId
      ? existingNews.authorId.toString() === payload.id
      : existingNews.author === admin.name;

    if (!ownsNews) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const news = await News.findByIdAndUpdate(
      id,
      {
        ...body,
        author: existingNews.author,
        authorId: existingNews.authorId,
      },
      {
        new: true,
        runValidators: true,
      }
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

export async function DELETE(
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
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existingNews = await News.findById(id);
    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          message: 'Berita tidak ditemukan',
        },
        { status: 404 }
      );
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const ownsNews = existingNews.authorId
      ? existingNews.authorId.toString() === payload.id
      : existingNews.author === admin.name;

    if (!ownsNews) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const news = await News.findByIdAndDelete(id);

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
        message: 'Berita berhasil dihapus',
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
