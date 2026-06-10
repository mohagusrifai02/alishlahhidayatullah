import dbConnect from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const admin = await Admin.findById(payload.id).select('-password');
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
