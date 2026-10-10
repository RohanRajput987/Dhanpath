"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Users, FileText, PieChart, Loader2, Check, X, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { fetchPendingLoans, approveLoan, Loan } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
    const { user, logout } = useAuth()
    const [pendingLoans, setPendingLoans] = React.useState<Loan[]>([])
    const [loading, setLoading] = React.useState(true)
    const [actionId, setActionId] = React.useState<number | null>(null)

    const loadData = async () => {
        try {
            const data = await fetchPendingLoans()
            setPendingLoans(data)
        } catch (err) {
            toast.error("Failed to load platform analytics")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (user) loadData()
    }, [user])

    const handleApprove = async (id: number) => {
        setActionId(id)
        try {
            await approveLoan(id)
            toast.success("Loan approved and listed in marketplace")
            loadData()
        } catch (err) {
            toast.error("Approval failed")
        } finally {
            setActionId(null)
        }
    }

    if (!user || user.role !== 'admin') {
        return <div className="p-10 text-center">Unauthorized Access</div>
    }

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-emerald-600" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
                        <p className="text-sm text-muted-foreground">Governance and platform oversight.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
                        <CardTitle className="text-xs font-bold uppercase">Total Users</CardTitle>
                        <Users className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 text-amber-700">
                        <CardTitle className="text-xs font-bold uppercase">Review Queue</CardTitle>
                        <FileText className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-900">{pendingLoans.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
                        <CardTitle className="text-xs font-bold uppercase">Active Volume</CardTitle>
                        <LayoutDashboard className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹24,500</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 text-muted-foreground">
                        <CardTitle className="text-xs font-bold uppercase">Platform ROI</CardTitle>
                        <PieChart className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14.2%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold">Loans Pending Review</h3>
                <div className="grid grid-cols-1 gap-4">
                    {pendingLoans.length === 0 ? (
                        <Card className="p-12 text-center border-2 border-dashed text-muted-foreground italic">
                            Clear skies! No pending loan requests at the moment.
                        </Card>
                    ) : (
                        pendingLoans.map(loan => (
                            <Card key={loan.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center">
                                        <div className="p-6 flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline">ID #{loan.id}</Badge>
                                                <h4 className="font-bold underline text-emerald-800">{loan.borrower_name}</h4>
                                            </div>
                                            <p className="text-2xl font-bold">₹{Number(loan.principal).toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground italic">" {loan.loan_purpose} "</p>
                                        </div>
                                        <div className="bg-muted/30 p-6 flex items-center justify-center gap-3 border-l">
                                            <Button
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                onClick={() => handleApprove(loan.id!)}
                                                disabled={actionId === loan.id}
                                            >
                                                {actionId === loan.id ? <Loader2 className="animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                                Approve
                                            </Button>
                                            <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
                                                <X className="mr-2 h-4 w-4" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
