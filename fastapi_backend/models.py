from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Date, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class RoleEnum(str, enum.Enum):
    admin = "admin"
    lender = "lender"
    borrower = "borrower"

class TransactionTypeEnum(str, enum.Enum):
    income = "income"
    expense = "expense"

class LoanStatusEnum(str, enum.Enum):
    pending = "pending"
    active = "active"
    paid = "paid"
    default = "default"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.lender)

    transactions = relationship("Transaction", back_populates="owner")
    budgets = relationship("Budget", back_populates="owner")
    loans_given = relationship("Loan", back_populates="lender", foreign_keys="[Loan.lender_id]")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(TransactionTypeEnum))
    amount = Column(Float)
    category = Column(String)
    description = Column(String, nullable=True)
    date = Column(Date)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="transactions")

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    amount = Column(Float)
    month = Column(String) # e.g., "2023-10"
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="budgets")

class BorrowerProfile(Base):
    __tablename__ = "borrowers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    father_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    profession = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship("Loan", back_populates="borrower")

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    lender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"))
    principal = Column(Float)
    interest_rate = Column(Float)
    start_date = Column(Date)
    due_date = Column(Date, nullable=True)
    loan_purpose = Column(String, nullable=True)
    status = Column(Enum(LoanStatusEnum), default=LoanStatusEnum.pending)
    
    lender = relationship("User", back_populates="loans_given", foreign_keys=[lender_id])
    borrower = relationship("BorrowerProfile", back_populates="loans")
