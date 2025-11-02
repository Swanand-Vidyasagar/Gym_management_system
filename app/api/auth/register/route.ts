import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { User, Login } = await import('../../../../backend/models');
    const { generateToken } = await import('../../../../backend/utils/jwt');
    
    const body = await req.json();
    const { name, phone, email, address, username, password } = body;

    // Validation
    if (!name || !phone || !email || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Check if user already exists with phone
    const existingUserByPhone = await User.findOne({ where: { phone } });
    if (existingUserByPhone) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this phone number' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingLogin = await Login.findOne({ where: { username } });
    if (existingLogin) {
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      address,
      role: 'member'
    });

    // Create login credentials
    await Login.create({
      username,
      password,
      user_id: user.user_id
    });

    // Generate token
    const token = generateToken(user.user_id);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role
        },
        token
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
