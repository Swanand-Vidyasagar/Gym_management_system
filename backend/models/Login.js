const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('./User');

const Login = sequelize.define('Login', {
  login_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    },
    unique: true
  }
}, {
  tableName: 'logins',
  timestamps: true,
  underscored: true
});

// Hash password before saving
Login.beforeCreate(async (login) => {
  if (login.password) {
    login.password = await bcrypt.hash(login.password, 10);
  }
});

Login.beforeUpdate(async (login) => {
  if (login.changed('password')) {
    login.password = await bcrypt.hash(login.password, 10);
  }
});

// Instance method to compare password
Login.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Define associations
Login.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Login, { foreignKey: 'user_id', as: 'login' });

module.exports = Login;

