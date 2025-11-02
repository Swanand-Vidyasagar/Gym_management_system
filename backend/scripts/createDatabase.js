const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  try {
    // Connect to MySQL server without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' created or already exists`);

    await connection.end();
    console.log('✅ Database creation completed');
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  }
};

createDatabase();

