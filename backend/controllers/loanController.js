const db = require('../database/db');

// Get all loans with borrower details
exports.getAllLoans = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, b.name as borrower_name 
            FROM loans l 
            JOIN borrowers b ON l.borrower_id = b.id 
            ORDER BY l.start_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new loan
exports.addLoan = async (req, res) => {
    const { borrower_id, principal, interest_rate, start_date, due_date, collateral, reference_number, loan_purpose, borrower_photo, payment_frequency, notes } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO loans (borrower_id, principal, interest_rate, start_date, due_date, collateral, reference_number, loan_purpose, borrower_photo, payment_frequency, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [borrower_id, principal, interest_rate, start_date, due_date, collateral, reference_number, loan_purpose, borrower_photo, payment_frequency, notes]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update loan status
exports.updateLoanStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE loans SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Loan status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete loan
exports.deleteLoan = async (req, res) => {
    try {
        await db.query('DELETE FROM loans WHERE id = ?', [req.params.id]);
        res.json({ message: 'Loan deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// NEW: Get loans by Borrower ID
exports.getLoansByBorrowerId = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, 
            (SELECT SUM(amount) FROM payments WHERE loan_id = l.id) as total_paid
            FROM loans l 
            WHERE l.borrower_id = ?
            ORDER BY l.start_date DESC
        `, [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
