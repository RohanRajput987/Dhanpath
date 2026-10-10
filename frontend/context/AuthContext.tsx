"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, login as apiLogin, logout as apiLogout } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('dhanpath_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        const data = await apiLogin(credentials);
        setUser(data.user);
        localStorage.setItem('dhanpath_user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') router.push('/admin');
        else if (data.user.role === 'lender') router.push('/lender');
        else router.push('/borrower');
    };

    const logout = () => {
        apiLogout();
        setUser(null);
        localStorage.removeItem('dhanpath_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
