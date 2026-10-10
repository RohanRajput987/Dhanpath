const db = require('../database/db');

exports.getFinancialStats = async (req, res) => {
    try {
        // Summary stats
        const [totals] = await db.query(`
            SELECT 
                SUM(principal) as total_principal,
                COUNT(id) as active_loans,
                (SELECT COUNT(*) FROM borrowers) as total_borrowers,
                (SELECT SUM(amount) FROM payments) as total_recovered
            FROM loans 
            WHERE status = 'active'
        `);

        // Lending vs Recovery by month
        const [trends] = await db.query(`
            SELECT 
                DATE_FORMAT(start_date, '%Y-%m') as month,
                SUM(principal) as lent,
                0 as recovered
            FROM loans
            GROUP BY month
            UNION ALL
            SELECT 
                DATE_FORMAT(payment_date, '%Y-%m') as month,
                0 as lent,
                SUM(amount) as recovered
            FROM payments
            GROUP BY month
            ORDER BY month ASC
        `);

        res.json({
            summary: totals[0],
            trends: trends
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
