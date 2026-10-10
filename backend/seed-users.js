const bcrypt = require('bcryptjs');
const db = require('./database/db');

async function seed() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Seed Admin
        await db.query(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin User', 'admin@dhanpath.com', hashedPassword, 'admin']
        );

        // Seed Lender
        await db.query(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Vijay Mallya', 'lender@dhanpath.com', hashedPassword, 'lender']
        );

        // Seed Borrower
        await db.query(
            'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Rohan Sharma', 'borrower@dhanpath.com', hashedPassword, 'borrower']
        );

        console.log('Seed users created:');
        console.log('Admin: admin@dhanpath.com / password123');
        console.log('Lender: lender@dhanpath.com / password123');
        console.log('Borrower: borrower@dhanpath.com / password123');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
