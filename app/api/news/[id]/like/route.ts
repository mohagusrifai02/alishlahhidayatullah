import dbConnect from '@/lib/mongodb';
import { Like } from '@/models/Like';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

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
    const clientIp = getClientIp(request);
    const newsId = new Types.ObjectId(id);

    const likesCount = await Like.countDocuments({ newsId });
    const userLike = await Like.findOne({ newsId, ipAddress: clientIp });

    return NextResponse.json(
      {
        success: true,
        data: {
          likesCount,
          isLiked: !!userLike,
        },
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
    const clientIp = getClientIp(request);
    const newsId = new Types.ObjectId(id);

    const existingLike = await Like.findOne({ newsId, ipAddress: clientIp });

    if (existingLike) {
      // Remove like
      await Like.deleteOne({ _id: existingLike._id });
    } else {
      // Add like
      await Like.create({ newsId, ipAddress: clientIp });
    }

    const likesCount = await Like.countDocuments({ newsId });

    return NextResponse.json(
      {
        success: true,
        data: {
          likesCount,
          isLiked: !existingLike,
        },
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
