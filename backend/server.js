const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dataRoutes = require('./routes/data');
const financialRoutes = require('./routes/financials');
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/data', dataRoutes);
app.use('/api', financialRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
