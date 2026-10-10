from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

import models, schemas, crud
from database import engine, get_db, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DhanPath API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY must be set in the environment")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


@app.post("/api/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/api/auth/login")
def login(user_credentials: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=user_credentials.email)
    if not user or not crud.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"token": access_token, "user": schemas.User.from_orm(user)}


# ------------------
# Finance (Income/Expense)
# ------------------
@app.get("/api/finance/transactions", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_transactions(db, user_id=current_user.id, skip=skip, limit=limit)

@app.post("/api/finance/transactions", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_transaction(db=db, transaction=transaction, user_id=current_user.id)

@app.delete("/api/finance/transactions/{transaction_id}", response_model=schemas.Transaction)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    transaction = crud.delete_transaction(db=db, transaction_id=transaction_id, user_id=current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

# ------------------
# Budgets
# ------------------
@app.get("/api/budgets", response_model=List[schemas.Budget])
def read_budgets(month: Optional[str] = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_budgets(db, user_id=current_user.id, month=month)

@app.post("/api/budgets", response_model=schemas.Budget)
def create_or_update_budget(budget: schemas.BudgetCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_budget(db=db, budget=budget, user_id=current_user.id)

# ------------------
# Borrowers & Loans
# ------------------
@app.get("/api/borrowers", response_model=List[schemas.Borrower])
def read_borrowers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_borrowers(db, skip=skip, limit=limit)

@app.post("/api/borrowers", response_model=schemas.Borrower)
def create_borrower(borrower: schemas.BorrowerCreate, db: Session = Depends(get_db)):
    return crud.create_borrower(db=db, borrower=borrower)

@app.get("/api/borrowers/{borrower_id}", response_model=schemas.Borrower)
def read_borrower(borrower_id: int, db: Session = Depends(get_db)):
    borrower = crud.get_borrower(db, borrower_id=borrower_id)
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return borrower

@app.get("/api/borrowers/{borrower_id}/loans", response_model=List[schemas.Loan])
def read_loans_by_borrower(borrower_id: int, db: Session = Depends(get_db)):
    return crud.get_loans_by_borrower(db, borrower_id=borrower_id)

@app.get("/api/loans", response_model=List[schemas.Loan])
def read_loans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_loans(db, skip=skip, limit=limit)

@app.get("/api/loans/my-loans", response_model=List[schemas.Loan])
def read_my_loans(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_loans_by_lender(db, lender_id=current_user.id)

@app.get("/api/loans/available", response_model=List[schemas.Loan])
def read_available_loans(db: Session = Depends(get_db)):
    # Returns pending loans
    all_loans = crud.get_loans(db)
    return [loan for loan in all_loans if loan.status == models.LoanStatusEnum.pending]

@app.post("/api/loans/request", response_model=schemas.Loan)
def request_loan(loan: schemas.LoanCreate, db: Session = Depends(get_db)):
    return crud.create_loan(db=db, loan=loan)

@app.post("/api/loans/{loan_id}/fund", response_model=schemas.Loan)
def fund_loan_endpoint(loan_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.RoleEnum.lender:
        raise HTTPException(status_code=403, detail="Not authorized to fund loans")
    loan = crud.fund_loan(db=db, loan_id=loan_id, lender_id=current_user.id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found or not pending")
    return loan

@app.get("/api/analytics", response_model=schemas.FinancialStats)
def get_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    transactions = crud.get_transactions(db, user_id=current_user.id)
    total_income = sum([t.amount for t in transactions if t.type == models.TransactionTypeEnum.income])
    total_expense = sum([t.amount for t in transactions if t.type == models.TransactionTypeEnum.expense])
    
    loans = crud.get_loans_by_lender(db, lender_id=current_user.id)
    total_lent = sum([l.principal for l in loans if l.status == models.LoanStatusEnum.active])
    active_loans = len([l for l in loans if l.status == models.LoanStatusEnum.active])

    return schemas.FinancialStats(
        total_income=total_income,
        total_expense=total_expense,
        total_lent=total_lent,
        active_loans=active_loans
    )
