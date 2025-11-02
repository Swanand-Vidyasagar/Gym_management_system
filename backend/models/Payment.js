const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Membership = require('./Membership');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  payment_method: {
    type: DataTypes.ENUM('UPI', 'Card', 'Cash', 'Net Banking'),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  membership_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'memberships',
      key: 'membership_id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'completed'
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

// Define associations
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Payment.belongsTo(Membership, { foreignKey: 'membership_id', as: 'membership' });

User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
Membership.hasMany(Payment, { foreignKey: 'membership_id', as: 'payments' });

module.exports = Payment;

