from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from models import RoleEnum, TransactionTypeEnum, LoanStatusEnum

class UserBase(BaseModel):
    name: str
    email: str
    role: RoleEnum = RoleEnum.lender

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    token: str
    user: User

class TransactionBase(BaseModel):
    type: TransactionTypeEnum
    amount: float
    category: str
    description: Optional[str] = None
    date: date

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class BudgetBase(BaseModel):
    category: str
    amount: float
    month: str

class BudgetCreate(BudgetBase):
    pass

class Budget(BudgetBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class BorrowerBase(BaseModel):
    name: str
    father_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    profession: Optional[str] = None

class BorrowerCreate(BorrowerBase):
    pass

class Borrower(BorrowerBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class LoanBase(BaseModel):
    borrower_id: int
    principal: float
    interest_rate: float
    start_date: date
    due_date: Optional[date] = None
    loan_purpose: Optional[str] = None
    status: LoanStatusEnum = LoanStatusEnum.pending

class LoanCreate(LoanBase):
    pass

class Loan(LoanBase):
    id: int
    lender_id: Optional[int] = None
    borrower: Optional[Borrower] = None
    class Config:
        from_attributes = True

class FinancialStats(BaseModel):
    total_income: float
    total_expense: float
    total_lent: float
    active_loans: int
