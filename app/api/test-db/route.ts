import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { sequelize } = await import('../../../../backend/config/database');
    await sequelize.authenticate();
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      dialect: process.env.DB_DIALECT || 'not set',
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDbDialect: !!process.env.DB_DIALECT,
        hasJwtSecret: !!process.env.JWT_SECRET,
        dbDialect: process.env.DB_DIALECT || 'not set'
      }
    }, { status: 500 });
  }
}
