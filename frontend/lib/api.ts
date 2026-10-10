declare const process: any;

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'lender' | 'borrower';
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('dhanpath_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const login = async (credentials: any): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('dhanpath_token', data.token);
    return data;
};

export const registerUser = async (userData: any): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
};

export const logout = () => {
    localStorage.removeItem('dhanpath_token');
};

export interface AnalyticsData {
    id?: number;
    category: string;
    value: number;
    label: string;
    created_at?: string;
}

// Financial Interfaces
export interface Borrower {
    id?: number;
    name: string;
    father_name?: string;
    father_phone?: string;
    phone?: string;
    email?: string;
    address?: string;
    profession?: string;
    photo?: string;
    created_at?: string;
}

export interface Loan {
    id?: number;
    borrower_id: number;
    borrower_name?: string;
    principal: number;
    interest_rate: number;
    start_date: string;
    due_date?: string;
    collateral?: string;
    reference_number?: string;
    loan_purpose?: string;
    borrower_photo?: string;
    payment_frequency: 'daily' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
    status: 'pending' | 'active' | 'paid' | 'default';
    notes?: string;
}

export interface FinancialStats {
    summary: {
        total_principal: number;
        active_loans: number;
        total_borrowers: number;
        total_recovered: number;
    };
    trends: {
        month: string;
        lent: number;
        recovered: number;
    }[];
}

// DhanPath P2P API Methods
export const requestLoan = async (loanData: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/loans/request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(loanData),
    });
    if (!res.ok) throw new Error('Failed to request loan');
    return res.json();
};

export const fetchPendingLoans = async (): Promise<Loan[]> => {
    const res = await fetch(`${API_BASE_URL}/loans/pending`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch pending loans');
    return res.json();
};

export const approveLoan = async (id: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/loans/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to approve loan');
    return res.json();
};

export const fetchAvailableLoans = async (): Promise<Loan[]> => {
    const res = await fetch(`${API_BASE_URL}/loans/available`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch available loans');
    return res.json();
};

export const fundLoan = async (id: number): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/loans/${id}/fund`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fund loan');
    return res.json();
};

export const fetchMyLoans = async (): Promise<Loan[]> => {
    const res = await fetch(`${API_BASE_URL}/loans/my-loans`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your loans');
    return res.json();
};

export const fetchBorrowers = async (): Promise<Borrower[]> => {
    const res = await fetch(`${API_BASE_URL}/borrowers`);
    if (!res.ok) throw new Error('Failed to fetch borrowers');
    return res.json();
};

export const fetchLoans = async (): Promise<Loan[]> => {
    const res = await fetch(`${API_BASE_URL}/loans`);
    if (!res.ok) throw new Error('Failed to fetch loans');
    return res.json();
};

export const fetchFinancialAnalytics = async (): Promise<FinancialStats> => {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
};

export const addBorrower = async (borrower: Borrower): Promise<Borrower> => {
    const res = await fetch(`${API_BASE_URL}/borrowers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(borrower),
    });
    if (!res.ok) throw new Error('Failed to add borrower');
    return res.json();
};

export const fetchBorrowerById = async (id: number): Promise<Borrower> => {
    const res = await fetch(`${API_BASE_URL}/borrowers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch borrower');
    return res.json();
};

export const fetchLoansByBorrowerId = async (id: number): Promise<Loan[]> => {
    const res = await fetch(`${API_BASE_URL}/borrowers/${id}/loans`);
    if (!res.ok) throw new Error('Failed to fetch borrower loans');
    return res.json();
};

export const addLoan = async (loan: Partial<Loan>): Promise<Loan> => {
    const res = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loan),
    });
    if (!res.ok) throw new Error('Failed to add loan');
    return res.json();
};

export const fetchData = async (): Promise<AnalyticsData[]> => {
    const response = await fetch(`${API_BASE_URL}/data`);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
};

export const addData = async (data: AnalyticsData): Promise<AnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to add data');
    }
    return response.json();
};

export const updateData = async (id: number, data: AnalyticsData): Promise<AnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update data');
    }
    return response.json();
};

export const deleteData = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete data');
    }
};

// --- Personal Finance API Methods ---
export interface Transaction {
    id?: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string;
}

export const fetchTransactions = async (): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE_URL}/finance/transactions`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
};

export const addTransaction = async (data: Transaction): Promise<Transaction> => {
    const res = await fetch(`${API_BASE_URL}/finance/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add transaction');
    return res.json();
};

export const deleteTransaction = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/finance/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
};

// --- Budget API Methods ---
export interface Budget {
    id?: number;
    category: string;
    amount: number;
    month: string;
}

export const fetchBudgets = async (month?: string): Promise<Budget[]> => {
    const url = month ? `${API_BASE_URL}/budgets?month=${month}` : `${API_BASE_URL}/budgets`;
    const res = await fetch(url, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
};

export const setBudget = async (data: Budget): Promise<Budget> => {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to set budget');
    return res.json();
};
