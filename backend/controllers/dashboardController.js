const { User, Membership, Payment, Staff } = require('../models');
const { Op } = require('sequelize');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.count();

    // Active memberships (not expired)
    const activeMemberships = await Membership.count({
      where: {
        status: 'active',
        end_date: { [Op.gte]: new Date() }
      }
    });

    // Total revenue (from all payments)
    const revenueResult = await Payment.sum('amount');
    const totalRevenue = revenueResult || 0;

    // Monthly revenue (current month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenueResult = await Payment.sum('amount', {
      where: {
        payment_date: { [Op.gte]: startOfMonth }
      }
    });
    const monthlyRevenue = monthlyRevenueResult || 0;

    // Total staff
    const totalStaff = await Staff.count();

    // Expiring memberships (next 7 days)
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

    // Recent payments (last 10)
    const recentPayments = await Payment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name'] }
      ],
      order: [['payment_date', 'DESC']],
      limit: 10
    });

    res.json({
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
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   GET /api/dashboard/revenue
 * @desc    Get revenue analytics
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    // Get last 12 months revenue
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const payments = await Payment.findAll({
      where: {
        payment_date: { [Op.gte]: twelveMonthsAgo }
      },
      attributes: ['amount', 'payment_date'],
      order: [['payment_date', 'ASC']]
    });

    // Group by month
    const monthlyRevenue = {};
    payments.forEach(payment => {
      const month = new Date(payment.payment_date).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(payment.amount);
    });

    // Payment method breakdown
    const paymentMethods = await Payment.findAll({
      attributes: ['payment_method', [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']],
      group: ['payment_method']
    });

    res.json({
      success: true,
      data: {
        monthlyRevenue,
        paymentMethods: paymentMethods.map(pm => ({
          method: pm.payment_method,
          total: pm.dataValues.total
        }))
      }
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

