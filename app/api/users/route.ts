import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { getAuthPayload } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: users,
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
    const body = await request.json();

    const user = await User.create(body);

    return NextResponse.json(
      {
        success: true,
        data: user,
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
