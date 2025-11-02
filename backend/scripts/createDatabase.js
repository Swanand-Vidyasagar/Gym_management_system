const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  try {
    // Check if required environment variables are set
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.error('❌ Missing required environment variables!');
      console.error('\nPlease create a .env file in the backend directory with:');
      console.error('DB_HOST=localhost');
      console.error('DB_PORT=3306');
      console.error('DB_NAME=gym_management');
      console.error('DB_USER=root');
      console.error('DB_PASSWORD=your_mysql_password');
      console.error('\nOr copy .env.example to .env and fill in your credentials.');
      process.exit(1);
    }

    // Connect to MySQL server without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
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
    console.error('❌ Error creating database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Make sure MySQL server is running');
      console.error('   Windows: Check Services → MySQL80');
      console.error('   Or run: net start MySQL80');
      console.error('2. Verify DB_HOST and DB_PORT in .env file');
      console.error('3. Check MySQL is listening on port', process.env.DB_PORT || 3306);
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Check your DB_USER and DB_PASSWORD in .env file');
      console.error('2. Verify MySQL username and password are correct');
      console.error('3. Test connection: mysql -u root -p');
    } else if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. MySQL server connection was lost');
      console.error('2. Make sure MySQL service is running');
      console.error('3. Check if firewall is blocking connection');
    }
    
    process.exit(1);
  }
};

createDatabase();

