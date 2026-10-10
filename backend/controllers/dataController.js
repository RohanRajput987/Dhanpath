const db = require('../database/db');

exports.getData = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM analytics_data ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM analytics_data WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addData = async (req, res) => {
    const { category, value, label } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO analytics_data (category, value, label) VALUES (?, ?, ?)',
            [category, value, label]
        );
        res.status(201).json({ id: result.insertId, category, value, label });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateData = async (req, res) => {
    const { id } = req.params;
    const { category, value, label } = req.body;
    try {
        await db.query(
            'UPDATE analytics_data SET category = ?, value = ?, label = ? WHERE id = ?',
            [category, value, label, id]
        );
        res.json({ id, category, value, label });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM analytics_data WHERE id = ?', [id]);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
