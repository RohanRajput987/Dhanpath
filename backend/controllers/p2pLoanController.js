const db = require('../database/db');

// Add new loan (Borrower requesting a loan)
exports.requestLoan = async (req, res) => {
    const {
        principal, interest_rate, loan_purpose, notes,
        collateral, reference_number, borrower_photo,
        payment_frequency, father_name, father_phone, borrower_profession
    } = req.body;
    const borrower_id = req.user.id; // From JWT
    try {
        const [result] = await db.query(
            `INSERT INTO loans (
                borrower_id, principal, interest_rate, loan_purpose, status, notes,
                collateral, reference_number, borrower_photo, payment_frequency,
                father_name, father_phone, borrower_profession
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                borrower_id, principal, interest_rate, loan_purpose, 'pending_approval', notes,
                collateral, reference_number, borrower_photo, payment_frequency,
                father_name, father_phone, borrower_profession
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Loan request submitted for review with KYC' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin: Get all pending loans
exports.getPendingLoans = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, b.name as borrower_name 
            FROM loans l 
            JOIN users b ON l.borrower_id = b.id 
            WHERE l.status = 'pending_approval'
            ORDER BY l.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin: Approve Loan
exports.approveLoan = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE loans SET status = 'funding_required' WHERE id = ?", [id]);
        res.json({ message: 'Loan approved and moved to funding marketplace' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lender: Get available loans to fund
exports.getAvailableLoans = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, b.name as borrower_name 
            FROM loans l 
            JOIN users b ON l.borrower_id = b.id 
            WHERE l.status = 'funding_required'
            ORDER BY l.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lender: Fund a loan
exports.fundLoan = async (req, res) => {
    const { id } = req.params;
    const lender_id = req.user.id;
    try {
        await db.query(
            "UPDATE loans SET status = 'active', lender_id = ?, start_date = CURDATE() WHERE id = ?",
            [lender_id, id]
        );
        res.json({ message: 'Loan successfully funded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get loans for current user (Borrower or Lender)
exports.getMyLoans = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    let query = '';

    if (role === 'borrower') {
        query = 'SELECT * FROM loans WHERE borrower_id = ? ORDER BY created_at DESC';
    } else if (role === 'lender') {
        query = 'SELECT * FROM loans WHERE lender_id = ? ORDER BY created_at DESC';
    } else {
        query = 'SELECT * FROM loans ORDER BY created_at DESC'; // Admin sees all
    }

    try {
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
