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
    const { Staff } = await import('../../../../backend/models');
    
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const staff = await Staff.findAll({
      order: [['hire_date', 'DESC']]
    });

    return NextResponse.json({
      success: true,
      count: staff.length,
      data: { staff }
    });
  } catch (error: any) {
    console.error('Get staff error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { Staff } = await import('../../../../backend/models');
    
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, email, role } = body;

    if (!name || !phone || !email || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const staff = await Staff.create({
      name,
      phone,
      email,
      role
    });

    return NextResponse.json({
      success: true,
      message: 'Staff member created successfully',
      data: { staff }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create staff error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
