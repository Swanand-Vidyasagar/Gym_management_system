import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
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
    const { User, Membership, Payment, Staff } = await import('../../../../backend/models');
    
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user to check if admin
    const user = await User.findByPk(auth.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const totalUsers = await User.count();
    const activeMemberships = await Membership.count({
      where: {
        status: 'active',
        end_date: { [Op.gte]: new Date() }
      }
    });

    const revenueResult = await Payment.sum('amount');
    const totalRevenue = revenueResult || 0;

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenueResult = await Payment.sum('amount', {
      where: {
        payment_date: { [Op.gte]: startOfMonth }
      }
    });
    const monthlyRevenue = monthlyRevenueResult || 0;

    const totalStaff = await Staff.count();

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringMemberships = await Membership.findAll({
      where: {
        end_date: {
          [Op.between]: [new Date(), sevenDaysFromNow]
        }
      },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      limit: 10
    });

    const recentPayments = await Payment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name'] }
      ],
      order: [['payment_date', 'DESC']],
      limit: 10
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeMemberships,
          totalRevenue,
          monthlyRevenue,
          totalStaff
        },
        expiringMemberships,
        recentPayments
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
