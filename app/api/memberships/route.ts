import { NextRequest, NextResponse } from 'next/server';

const { Membership, User, Staff } = require('../../../../backend/models');
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

    const memberships = await Membership.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name', 'role'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return NextResponse.json({
      success: true,
      count: memberships.length,
      data: { memberships }
    });
  } catch (error: any) {
    console.error('Get memberships error:', error);
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
    const { type, user_id, staff_id, start_date } = body;

    if (!type || !user_id || !staff_id) {
      return NextResponse.json(
        { success: false, message: 'Type, user_id, and staff_id are required' },
        { status: 400 }
      );
    }

    const { calculateEndDate, getMembershipPrice } = require('../../../../backend/utils/membershipCalculator');

    const user = await User.findByPk(user_id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const staff = await Staff.findByPk(staff_id);
    if (!staff) {
      return NextResponse.json(
        { success: false, message: 'Staff not found' },
        { status: 404 }
      );
    }

    const actualStartDate = start_date ? new Date(start_date) : new Date();
    const end_date = calculateEndDate(actualStartDate, type);
    const price = getMembershipPrice(type);

    const membership = await Membership.create({
      type,
      start_date: actualStartDate,
      end_date,
      price,
      user_id,
      staff_id
    });

    const createdMembership = await Membership.findByPk(membership.membership_id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name', 'role'] }
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Membership created successfully',
      data: { membership: createdMembership }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create membership error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
