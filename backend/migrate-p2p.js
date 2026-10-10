const db = require('./database/db');

async function run() {
    try {
        console.log('Starting migration...');

        // Users table
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'lender', 'borrower') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created/verified');

        // Update loans table
        try {
            await db.query("ALTER TABLE loans ADD COLUMN lender_id INT AFTER borrower_id");
            console.log('Added lender_id to loans');
        } catch (e) { console.log('lender_id already exists or error adding'); }

        try {
            await db.query("ALTER TABLE loans ADD COLUMN repayment_status ENUM('pending', 'partially_paid', 'fully_paid') DEFAULT 'pending' AFTER status");
            console.log('Added repayment_status to loans');
        } catch (e) { console.log('repayment_status already exists'); }

        try {
            await db.query("ALTER TABLE loans ADD FOREIGN KEY (lender_id) REFERENCES users(id)");
            console.log('Added foreign key for lender_id');
        } catch (e) { console.log('Foreign key already exists or user table empty'); }

        // Transactions table
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                loan_id INT NOT NULL,
                payment_amount DECIMAL(15, 2) NOT NULL,
                payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('success', 'failed', 'pending') DEFAULT 'success',
                FOREIGN KEY (loan_id) REFERENCES loans(id)
            )
        `);
        console.log('Transactions table created/verified');

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

run();
