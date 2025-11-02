// Shared database configuration for Next.js API routes
const { Sequelize } = require('sequelize');

// Determine dialect (postgres for Supabase, mysql for local MySQL)
const dialect = process.env.DB_DIALECT || (process.env.DATABASE_URL ? 'postgres' : 'mysql');

// Create Sequelize instance
let sequelize;

if (process.env.DATABASE_URL && dialect === 'postgres') {
  // Use connection string for Supabase (recommended)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Supabase
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Use individual connection values
  sequelize = new Sequelize(
    process.env.DB_NAME || (dialect === 'postgres' ? 'postgres' : 'gym_management'),
    process.env.DB_USER || (dialect === 'postgres' ? 'postgres' : 'root'),
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || (dialect === 'postgres' ? '5432' : '3306')),
      dialect: dialect,
      dialectOptions: dialect === 'postgres' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false // Required for Supabase
        }
      } : {},
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };
