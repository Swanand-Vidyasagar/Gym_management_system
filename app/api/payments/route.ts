import { NextRequest, NextResponse } from 'next/server';

const { Payment, User, Membership } = require('../../../../backend/models');
const jwt = require('jsonwebtoken');

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
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const whereClause: any = {};
    if (userId) {
      whereClause.user_id = parseInt(userId);
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] },
        { model: Membership, as: 'membership', attributes: ['membership_id', 'type', 'price'] }
      ],
      order: [['payment_date', 'DESC']]
    });

    return NextResponse.json({
      success: true,
      count: payments.length,
      data: { payments }
    });
  } catch (error: any) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, payment_method, user_id, membership_id } = body;

    if (!amount || !payment_method || !user_id) {
      return NextResponse.json(
        { success: false, message: 'Amount, payment_method, and user_id are required' },
        { status: 400 }
      );
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (membership_id) {
      const membership = await Membership.findByPk(membership_id);
      if (!membership) {
        return NextResponse.json(
          { success: false, message: 'Membership not found' },
          { status: 404 }
        );
      }
    }

    const payment = await Payment.create({
      amount,
      payment_method,
      user_id,
      membership_id,
      payment_date: new Date()
    });

    const createdPayment = await Payment.findByPk(payment.payment_id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] },
        { model: Membership, as: 'membership', attributes: ['membership_id', 'type', 'price'] }
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
      data: { payment: createdPayment }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
