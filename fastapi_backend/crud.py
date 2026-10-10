from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Transactions
def get_transactions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).filter(models.Transaction.owner_id == user_id).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    db_transaction = models.Transaction(**transaction.model_dump(), owner_id=user_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db: Session, transaction_id: int, user_id: int):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id, models.Transaction.owner_id == user_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
    return db_transaction

# Budgets
def get_budgets(db: Session, user_id: int, month: str = None):
    query = db.query(models.Budget).filter(models.Budget.owner_id == user_id)
    if month:
        query = query.filter(models.Budget.month == month)
    return query.all()

def create_budget(db: Session, budget: schemas.BudgetCreate, user_id: int):
    # Check if budget for this category and month exists
    existing_budget = db.query(models.Budget).filter(
        models.Budget.owner_id == user_id, 
        models.Budget.category == budget.category,
        models.Budget.month == budget.month
    ).first()
    
    if existing_budget:
        existing_budget.amount = budget.amount
        db.commit()
        db.refresh(existing_budget)
        return existing_budget
        
    db_budget = models.Budget(**budget.model_dump(), owner_id=user_id)
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

# Borrowers
def get_borrowers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.BorrowerProfile).offset(skip).limit(limit).all()

def create_borrower(db: Session, borrower: schemas.BorrowerCreate):
    db_borrower = models.BorrowerProfile(**borrower.model_dump())
    db.add(db_borrower)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower

def get_borrower(db: Session, borrower_id: int):
    return db.query(models.BorrowerProfile).filter(models.BorrowerProfile.id == borrower_id).first()

# Loans
def get_loans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Loan).offset(skip).limit(limit).all()

def get_loans_by_lender(db: Session, lender_id: int):
    return db.query(models.Loan).filter(models.Loan.lender_id == lender_id).all()

def get_loans_by_borrower(db: Session, borrower_id: int):
    return db.query(models.Loan).filter(models.Loan.borrower_id == borrower_id).all()

def create_loan(db: Session, loan: schemas.LoanCreate):
    db_loan = models.Loan(**loan.model_dump())
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def fund_loan(db: Session, loan_id: int, lender_id: int):
    db_loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    if db_loan and db_loan.status == models.LoanStatusEnum.pending:
        db_loan.status = models.LoanStatusEnum.active
        db_loan.lender_id = lender_id
        db.commit()
        db.refresh(db_loan)
    return db_loan
