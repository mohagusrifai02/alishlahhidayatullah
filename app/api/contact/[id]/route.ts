import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { getAuthPayload } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, context: any) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // context.params can be a Promise in some Next.js runtime types on Vercel
    let params: any = context?.params;
    if (params && typeof params.then === 'function') {
      try {
        params = await params;
      } catch {
        params = undefined;
      }
    }

    const idFromParams = params?.id;
    const idFromPath = request.nextUrl?.pathname?.split('/')?.pop();
    const id = idFromParams || idFromPath;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id parameter' }, { status: 400 });
    }

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: contact }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
