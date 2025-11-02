import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function getAuthUser(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { User } = await import('../../../../backend/models');
    
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'No token provided or invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findByPk(auth.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
