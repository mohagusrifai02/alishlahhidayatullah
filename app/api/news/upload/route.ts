import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import { News } from '@/models/News';

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint accepts multipart/form-data via POST to upload an image to Cloudinary.',
    },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const newsId = formData.get('newsId')?.toString();
    const field = formData.get('field')?.toString();

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'File tidak ditemukan' }, { status: 400 });
    }

    const url = await uploadToCloudinary(file, 'news');

    if (newsId && field && ['image', 'subImage'].includes(field)) {
      await dbConnect();
      const news = await News.findByIdAndUpdate(
        newsId,
        { [field]: url },
        { new: true, runValidators: true }
      );

      if (!news) {
        return NextResponse.json(
          {
            success: false,
            message: 'Berita tidak ditemukan untuk update URL gambar',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: { url },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Upload gagal',
      },
      { status: 400 }
    );
  }
}
