import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, generateAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify admin password
    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Generate admin token
    const token = generateAdminToken();

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: 'admin',
          username: 'admin',
          isAdmin: true,
        },
      },
    });
  } catch (error) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}