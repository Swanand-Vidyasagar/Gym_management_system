import { NextResponse } from 'next/server';

export async function GET() {
  const env = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDbDialect: !!process.env.DB_DIALECT,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
    dbDialect: process.env.DB_DIALECT || 'not set',
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const { sequelize } = await import('../../../../backend/config/database');
    await sequelize.authenticate();
    return NextResponse.json({
      success: true,
      message: 'All checks passed',
      env,
      database: 'connected'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      env,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
