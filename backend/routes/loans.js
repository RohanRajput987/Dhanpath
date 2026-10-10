const express = require('express');
const router = express.Router();
const p2pController = require('../controllers/p2pLoanController');
const auth = require('../middleware/authMiddleware');

// Borrower routes
router.post('/request', auth(['borrower']), p2pController.requestLoan);
router.get('/my-loans', auth(['borrower', 'lender']), p2pController.getMyLoans);

// Admin routes
router.get('/pending', auth(['admin']), p2pController.getPendingLoans);
router.post('/:id/approve', auth(['admin']), p2pController.approveLoan);

// Lender routes
router.get('/available', auth(['lender']), p2pController.getAvailableLoans);
router.post('/:id/fund', auth(['lender']), p2pController.fundLoan);

module.exports = router;
