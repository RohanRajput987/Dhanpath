"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react"
import { fetchTransactions, addTransaction, deleteTransaction, Transaction } from "@/lib/api"
import { toast } from "sonner"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState<'income' | 'expense'>('expense')
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const loadTransactions = async () => {
        try {
            const data = await fetchTransactions()
            setTransactions(data)
        } catch (error) {
            toast.error("Failed to load transactions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTransactions()
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addTransaction({
                type,
                amount: parseFloat(amount),
                category,
                description,
                date
            })
            toast.success("Transaction added!")
            setAmount("")
            setCategory("")
            setDescription("")
            loadTransactions()
        } catch (err) {
            toast.error("Error adding transaction")
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteTransaction(id)
            toast.success("Transaction deleted")
            loadTransactions()
        } catch (err) {
            toast.error("Error deleting transaction")
        }
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const balance = totalIncome - totalExpense

    // Chart data for expenses
    const expenseData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc: any, t) => {
            const existing = acc.find((item: any) => item.name === t.category)
            if (existing) {
                existing.value += t.amount
            } else {
                acc.push({ name: t.category, value: t.amount })
            }
            return acc
        }, [])

    const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ea580c', '#c2410c']

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-orange-950 uppercase tracking-tighter">Personal Finance</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-orange-100 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4 text-green-500" /> Income
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-green-600 tracking-tighter">₹{totalIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-orange-100 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                            <ArrowDownCircle className="w-4 h-4 text-red-500" /> Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-600 tracking-tighter">₹{totalExpense.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-500 text-white shadow-md shadow-orange-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-orange-100 uppercase tracking-widest">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">₹{balance.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-orange-950 uppercase tracking-tighter">Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <div className="text-center py-10 text-orange-300 font-bold italic">No transactions found.</div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map(t => (
                                        <div key={t.id} className="flex items-center justify-between p-4 border border-orange-50 rounded-xl hover:shadow-md transition-shadow bg-white group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {t.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-orange-950">{t.category}</p>
                                                    <p className="text-xs text-orange-400 font-bold">{new Date(t.date).toLocaleDateString()} {t.description && `• ${t.description}`}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`font-black tracking-tighter text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                                </div>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600" onClick={() => handleDelete(t.id!)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-orange-100 shadow-sm bg-orange-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-orange-950 uppercase tracking-tighter">Add Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="flex bg-white p-1 rounded-xl border border-orange-100">
                                    <button type="button" className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'text-orange-400 hover:bg-orange-50'}`} onClick={() => setType('income')}>Income</button>
                                    <button type="button" className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'text-orange-400 hover:bg-orange-50'}`} onClick={() => setType('expense')}>Expense</button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Amount (₹)</label>
                                    <Input required type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-orange-200 focus-visible:ring-orange-500 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Category</label>
                                    <Input required placeholder="e.g. Salary, Groceries" value={category} onChange={(e) => setCategory(e.target.value)} className="border-orange-200 focus-visible:ring-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Date</label>
                                    <Input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-orange-200 focus-visible:ring-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Description (Optional)</label>
                                    <Input value={description} onChange={(e) => setDescription(e.target.value)} className="border-orange-200 focus-visible:ring-orange-500" />
                                </div>
                                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                    <Plus className="w-4 h-4 mr-2" /> Add {type}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-black text-orange-950 uppercase tracking-tighter">Expense Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] flex items-center justify-center">
                            {expenseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {expenseData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-orange-300 font-bold italic text-sm">No expenses to visualize</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
