import dbConnect from '@/lib/mongodb';
import { Like } from '@/models/Like';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const likesData = await Like.aggregate([
      {
        $group: {
          _id: '$newsId',
          likesCount: { $sum: 1 },
        },
      },
    ]);

    const likesMap = new Map();
    likesData.forEach((item) => {
      likesMap.set(item._id.toString(), item.likesCount);
    });

    return NextResponse.json(
      {
        success: true,
        data: Object.fromEntries(likesMap),
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
