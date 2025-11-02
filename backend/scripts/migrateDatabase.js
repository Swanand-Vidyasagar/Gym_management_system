const { sequelize } = require('../config/database');
const { User, Login, Staff, Membership, Payment } = require('../models');

const migrateDatabase = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync all models
    // { force: true } will drop existing tables - use with caution!
    // { alter: true } will alter tables to match models
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ All models synchronized');

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateDatabase();

