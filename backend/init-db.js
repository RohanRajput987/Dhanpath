const db = require('./database/db');

const initDB = async () => {
    try {
        // Create Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS analytics_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        value INT NOT NULL,
        label VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Table created or already exists.');

        // Seed Data
        const [rows] = await db.query('SELECT COUNT(*) as count FROM analytics_data');
        if (rows[0].count === 0) {
            const seedData = [
                ['Electronics', 400, 'Jan'],
                ['Clothing', 300, 'Jan'],
                ['Food', 200, 'Jan'],
                ['Electronics', 450, 'Feb'],
                ['Clothing', 320, 'Feb'],
                ['Food', 250, 'Feb'],
                ['Electronics', 500, 'Mar'],
                ['Clothing', 350, 'Mar'],
                ['Food', 280, 'Mar'],
            ];
            await db.query(
                'INSERT INTO analytics_data (category, value, label) VALUES ?',
                [seedData]
            );
            console.log('Sample data seeded.');
        } else {
            console.log('Data already exists, skipping seed.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDB();
