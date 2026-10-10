const db = require('../database/db');

// Get all borrowers
exports.getAllBorrowers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM borrowers ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get borrower by ID
exports.getBorrowerById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM borrowers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Borrower not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new borrower
exports.addBorrower = async (req, res) => {
    const { name, father_name, father_phone, phone, email, address, profession, photo } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO borrowers (name, father_name, father_phone, phone, email, address, profession, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, father_name, father_phone, phone, email, address, profession, photo]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update borrower
exports.updateBorrower = async (req, res) => {
    const { name, father_name, father_phone, phone, email, address, profession, photo } = req.body;
    try {
        await db.query(
            'UPDATE borrowers SET name = ?, father_name = ?, father_phone = ?, phone = ?, email = ?, address = ?, profession = ?, photo = ? WHERE id = ?',
            [name, father_name, father_phone, phone, email, address, profession, photo, req.params.id]
        );
        res.json({ message: 'Borrower updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete borrower
exports.deleteBorrower = async (req, res) => {
    try {
        await db.query('DELETE FROM borrowers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Borrower deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
