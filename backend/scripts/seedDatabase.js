const { User, Login, Staff, Membership, Payment } = require('../models');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Payment.destroy({ where: {}, force: true });
    await Membership.destroy({ where: {}, force: true });
    await Login.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await Staff.destroy({ where: {}, force: true });

    // Seed Staff
    console.log('👨‍💼 Seeding staff...');
    const staffMembers = await Staff.bulkCreate([
      {
        name: 'Rajesh Kulkarni',
        phone: '+91-98765-43210',
        email: 'rajesh.kulkarni@gym.com',
        role: 'Manager'
      },
      {
        name: 'Priya Deshpande',
        phone: '+91-98765-43211',
        email: 'priya.deshpande@gym.com',
        role: 'Trainer'
      },
      {
        name: 'Amit Joshi',
        phone: '+91-98765-43212',
        email: 'amit.joshi@gym.com',
        role: 'Trainer'
      },
      {
        name: 'Anjali Patil',
        phone: '+91-98765-43213',
        email: 'anjali.patil@gym.com',
        role: 'Receptionist'
      }
    ]);
    console.log(`✅ Created ${staffMembers.length} staff members`);

    // Seed Users
    console.log('👥 Seeding users...');
    const users = await User.bulkCreate([
      {
        name: 'Swanand Vidyasagar',
        phone: '+91-98765-43220',
        email: 'swanand.vidyasagar@example.com',
        address: 'Flat 302, Sahyadri Apartments, Fergusson College Road, Pune, Maharashtra 411004',
        role: 'admin'
      },
      {
        name: 'Rohit Pawar',
        phone: '+91-98765-43221',
        email: 'rohit.pawar@example.com',
        address: 'House No. 15, Shivaji Nagar, Mumbai, Maharashtra 400018',
        role: 'member'
      },
      {
        name: 'Kavita More',
        phone: '+91-98765-43222',
        email: 'kavita.more@example.com',
        address: 'A-204, Green Valley Society, Viman Nagar, Pune, Maharashtra 411014',
        role: 'member'
      },
      {
        name: 'Vikram Chavan',
        phone: '+91-98765-43223',
        email: 'vikram.chavan@example.com',
        address: 'B-56, Sai Krupa Society, Kothrud, Pune, Maharashtra 411038',
        role: 'member'
      },
      {
        name: 'Neha Shinde',
        phone: '+91-98765-43224',
        email: 'neha.shinde@example.com',
        address: 'Plot 42, Ganesh Colony, Nashik, Maharashtra 422005',
        role: 'member'
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Seed Login credentials
    console.log('🔐 Seeding login credentials...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const logins = await Login.bulkCreate([
      {
        username: 'swanand',
        password: hashedPassword,
        user_id: users[0].user_id
      },
      {
        username: 'rohit_pawar',
        password: hashedPassword,
        user_id: users[1].user_id
      },
      {
        username: 'kavita_more',
        password: hashedPassword,
        user_id: users[2].user_id
      },
      {
        username: 'vikram_chavan',
        password: hashedPassword,
        user_id: users[3].user_id
      },
      {
        username: 'neha_shinde',
        password: hashedPassword,
        user_id: users[4].user_id
      }
    ]);
    console.log(`✅ Created ${logins.length} login credentials`);

    // Seed Memberships
    console.log('🎯 Seeding memberships...');
    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
    const ninetyDaysLater = new Date(now);
    ninetyDaysLater.setDate(ninetyDaysLater.getDate() + 90);

    const memberships = await Membership.bulkCreate([
      {
        type: 'Premium Plus',
        start_date: now,
        end_date: ninetyDaysLater,
        price: 2499.00,
        user_id: users[1].user_id,
        staff_id: staffMembers[0].staff_id,
        status: 'active'
      },
      {
        type: 'Elite Pro',
        start_date: now,
        end_date: ninetyDaysLater,
        price: 4999.00,
        user_id: users[2].user_id,
        staff_id: staffMembers[1].staff_id,
        status: 'active'
      },
      {
        type: 'Annual Unlimited',
        start_date: now,
        end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        price: 8999.00,
        user_id: users[3].user_id,
        staff_id: staffMembers[2].staff_id,
        status: 'active'
      },
      {
        type: 'Basic',
        start_date: now,
        end_date: thirtyDaysLater,
        price: 999.00,
        user_id: users[4].user_id,
        staff_id: staffMembers[0].staff_id,
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${memberships.length} memberships`);

    // Seed Payments
    console.log('💳 Seeding payments...');
    const payments = await Payment.bulkCreate([
      {
        amount: 2499.00,
        payment_date: now,
        payment_method: 'Card',
        user_id: users[1].user_id,
        membership_id: memberships[0].membership_id,
        status: 'completed'
      },
      {
        amount: 4999.00,
        payment_date: now,
        payment_method: 'UPI',
        user_id: users[2].user_id,
        membership_id: memberships[1].membership_id,
        status: 'completed'
      },
      {
        amount: 8999.00,
        payment_date: now,
        payment_method: 'Net Banking',
        user_id: users[3].user_id,
        membership_id: memberships[2].membership_id,
        status: 'completed'
      },
      {
        amount: 999.00,
        payment_date: now,
        payment_method: 'Cash',
        user_id: users[4].user_id,
        membership_id: memberships[3].membership_id,
        status: 'completed'
      },
      {
        amount: 2499.00,
        payment_date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        payment_method: 'Card',
        user_id: users[1].user_id,
        membership_id: memberships[0].membership_id,
        status: 'completed'
      }
    ]);
    console.log(`✅ Created ${payments.length} payments`);

    console.log('✅ Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${staffMembers.length} staff members created`);
    console.log(`   - ${memberships.length} memberships created`);
    console.log(`   - ${payments.length} payments created`);
    console.log('\n🔑 Default login credentials:');
    console.log('   Username: swanand (Admin), rohit_pawar, kavita_more, vikram_chavan, neha_shinde');
    console.log('   Password: password123');
    console.log('\n💡 Remember to change passwords in production!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

