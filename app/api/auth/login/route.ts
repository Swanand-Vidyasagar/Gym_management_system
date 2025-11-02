import { NextRequest, NextResponse } from 'next/server';

// Use dynamic require for CommonJS modules
const { User, Login } = require('../../../../backend/models');
const { generateToken } = require('../../../../backend/utils/jwt');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find login credentials
    const login = await Login.findOne({
      where: { username },
      include: [{ model: User, as: 'user' }]
    });

    if (!login || !login.user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await login.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(login.user.user_id);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          user_id: login.user.user_id,
          name: login.user.name,
          email: login.user.email,
          phone: login.user.phone,
          role: login.user.role
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
