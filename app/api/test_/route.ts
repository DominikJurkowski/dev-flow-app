import handleError from '@/lib/handlers/error';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: 'Hello, world!' }, { status: 200 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
