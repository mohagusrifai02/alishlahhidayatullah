import dbConnect from '@/lib/mongodb';
import { News } from '@/models/News';
import { Admin } from '@/models/Admin';
import { getAuthPayload } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const mine = searchParams.get('mine') === 'true';

    let query: any = {};
    if (category && category !== 'semua') {
      query.category = category;
    }

    if (mine) {
      const payload = getAuthPayload(request);
      if (!payload?.id) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      query.authorId = payload.id;
    }

    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit);

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

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const news = await News.create({
      ...body,
      slug,
      authorId: admin._id?.toString(),
      author: admin.name,
    });

    return NextResponse.json(
      {
        success: true,
        data: news,
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
