const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowerController');
const loanController = require('../controllers/loanController');
const analyticsController = require('../controllers/analyticsController');

// Borrowers
router.get('/borrowers', borrowerController.getAllBorrowers);
router.post('/borrowers', borrowerController.addBorrower);
router.get('/borrowers/:id', borrowerController.getBorrowerById);
router.get('/borrowers/:id/loans', loanController.getLoansByBorrowerId);
router.put('/borrowers/:id', borrowerController.updateBorrower);
router.delete('/borrowers/:id', borrowerController.deleteBorrower);

// Loans
router.get('/loans', loanController.getAllLoans);
router.post('/loans', loanController.addLoan);
router.put('/loans/:id/status', loanController.updateLoanStatus);
router.delete('/loans/:id', loanController.deleteLoan);

// Analytics
router.get('/analytics', analyticsController.getFinancialStats);

module.exports = router;
