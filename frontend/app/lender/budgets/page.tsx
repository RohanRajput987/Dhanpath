"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, AlertTriangle } from "lucide-react"
import { fetchBudgets, setBudget, fetchTransactions, Budget, Transaction } from "@/lib/api"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

export default function BudgetsDashboard() {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

    const loadData = async () => {
        try {
            const [b, t] = await Promise.all([
                fetchBudgets(currentMonth),
                fetchTransactions()
            ])
            setBudgets(b)
            setTransactions(t.filter(x => x.type === 'expense' && x.date.startsWith(currentMonth)))
        } catch (error) {
            toast.error("Failed to load budgets data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleSetBudget = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await setBudget({
                category,
                amount: parseFloat(amount),
                month: currentMonth
            })
            toast.success("Budget set successfully!")
            setCategory("")
            setAmount("")
            loadData()
        } catch (err) {
            toast.error("Error setting budget")
        }
    }

    const calculateSpent = (cat: string) => {
        return transactions
            .filter(t => t.category.toLowerCase() === cat.toLowerCase())
            .reduce((sum, t) => sum + t.amount, 0)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-orange-950 uppercase tracking-tighter">Monthly Budgets ({currentMonth})</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-orange-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-orange-950 uppercase tracking-tighter flex items-center gap-2">
                                <Target className="w-5 h-5 text-orange-500" /> Budget Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {budgets.length === 0 ? (
                                <div className="text-center py-10 text-orange-300 font-bold italic">No budgets set for this month.</div>
                            ) : (
                                <div className="space-y-6">
                                    {budgets.map(b => {
                                        const spent = calculateSpent(b.category)
                                        const percentage = Math.min((spent / b.amount) * 100, 100)
                                        const isWarning = percentage >= 80
                                        const isExceeded = spent > b.amount
                                        return (
                                            <div key={b.id} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h3 className="font-bold text-orange-950 text-lg">{b.category}</h3>
                                                        <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">
                                                            {isExceeded ? 'Exceeded by' : 'Remaining'}: ₹{Math.abs(b.amount - spent).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-black tracking-tighter text-orange-950">₹{spent.toLocaleString()}</span>
                                                        <span className="text-sm font-bold text-orange-300"> / ₹{b.amount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <Progress value={percentage} className={`h-3 ${isExceeded ? 'bg-red-100' : isWarning ? 'bg-orange-100' : 'bg-green-100'}`} indicatorClassName={`${isExceeded ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-green-500'}`} />
                                                {isWarning && !isExceeded && (
                                                    <p className="text-[10px] text-orange-500 font-black flex items-center gap-1 uppercase tracking-widest mt-1">
                                                        <AlertTriangle className="w-3 h-3" /> Approaching Limit
                                                    </p>
                                                )}
                                                {isExceeded && (
                                                    <p className="text-[10px] text-red-500 font-black flex items-center gap-1 uppercase tracking-widest mt-1">
                                                        <AlertTriangle className="w-3 h-3" /> Budget Exceeded
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-orange-100 shadow-sm bg-orange-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-orange-950 uppercase tracking-tighter">Set Budget</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSetBudget} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Category</label>
                                    <Input required placeholder="e.g. Food, Rent, Transport" value={category} onChange={(e) => setCategory(e.target.value)} className="border-orange-200 focus-visible:ring-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Monthly Limit (₹)</label>
                                    <Input required type="number" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-orange-200 focus-visible:ring-orange-500 font-bold" />
                                </div>
                                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                    Set Limit
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
