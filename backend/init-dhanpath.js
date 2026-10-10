const db = require('./database/db');

const initDhanPathDB = async () => {
    try {
        // 1. Borrowers Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS borrowers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Borrowers table created.');

        // 2. Loans Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS loans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                borrower_id INT NOT NULL,
                interest_rate DECIMAL(5, 2) NOT NULL,
                collateral VARCHAR(255),
                reference_number VARCHAR(100),
                loan_purpose TEXT,
                borrower_photo TEXT,
                payment_frequency ENUM('daily', 'monthly', 'quarterly', 'half-yearly', 'yearly') DEFAULT 'monthly',
                father_name VARCHAR(255),
                father_phone VARCHAR(20),
                borrower_profession VARCHAR(255),
                start_date DATE,
                due_date DATE,
                status ENUM('active', 'paid', 'default', 'pending_approval', 'funding_required') DEFAULT 'pending_approval',
                repayment_status ENUM('pending', 'partially_paid', 'fully_paid') DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
            )
        `);
        console.log('Loans table created.');

        // 3. Payments Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                loan_id INT NOT NULL,
                amount DECIMAL(15, 2) NOT NULL,
                payment_date DATE NOT NULL,
                type ENUM('principal', 'interest', 'both') DEFAULT 'both',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
            )
        `);
        console.log('Payments table created.');

        // Seed Initial Data
        const [borrowers] = await db.query('SELECT COUNT(*) as count FROM borrowers');
        if (borrowers[0].count === 0) {
            console.log('Seeding initial financial data...');

            // Add Borrowers
            await db.query(`
                INSERT INTO borrowers (name, phone, email) VALUES 
                ('Rajesh Kumar', '9876543210', 'rajesh@example.com'),
                ('Sita Sharma', '9123456789', 'sita@example.com'),
                ('Amit Patel', '9988776655', 'amit@example.com')
            `);

            // Add Loans
            await db.query(`
                INSERT INTO loans (borrower_id, principal, interest_rate, start_date) VALUES 
                (1, 50000.00, 12.00, '2026-01-15'),
                (2, 25000.00, 10.00, '2026-02-01'),
                (3, 100000.00, 15.00, '2025-12-10')
            `);

            // Add some payments
            await db.query(`
                INSERT INTO payments (loan_id, amount, payment_date, type) VALUES 
                (1, 5000.00, '2026-02-15', 'both'),
                (2, 2500.00, '2026-03-01', 'interest')
            `);

            console.log('DhanPath sample data seeded successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error initializing DhanPath database:', error);
        process.exit(1);
    }
};

initDhanPathDB();
