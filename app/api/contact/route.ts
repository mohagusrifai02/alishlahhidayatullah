import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { getAuthPayload } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await dbConnect();

    const contact = await Contact.create(body);

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: contacts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
