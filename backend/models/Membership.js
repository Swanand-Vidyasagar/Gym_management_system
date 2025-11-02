const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Staff = require('./Staff');

const Membership = sequelize.define('Membership', {
  membership_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('Basic', 'Premium Plus', 'Elite Pro', 'Annual Unlimited'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
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
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'staff_id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active'
  }
}, {
  tableName: 'memberships',
  timestamps: true,
  underscored: true
});

// Define associations
Membership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Membership.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });

User.hasMany(Membership, { foreignKey: 'user_id', as: 'memberships' });
Staff.hasMany(Membership, { foreignKey: 'staff_id', as: 'assignedMemberships' });

module.exports = Membership;

