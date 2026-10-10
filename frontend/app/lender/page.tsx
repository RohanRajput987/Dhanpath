"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, Search, TrendingUp, History, Coins, Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { fetchAvailableLoans, fundLoan, fetchMyLoans, Loan } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function LenderDashboard() {
    const { user, logout } = useAuth()
    const [availableLoans, setAvailableLoans] = React.useState<Loan[]>([])
    const [portfolio, setPortfolio] = React.useState<Loan[]>([])
    const [loading, setLoading] = React.useState(true)
    const [fundingId, setFundingId] = React.useState<number | null>(null)

    const loadData = async () => {
        try {
            const [available, mine] = await Promise.all([
                fetchAvailableLoans(),
                fetchMyLoans()
            ])
            setAvailableLoans(available)
            setPortfolio(mine)
        } catch (err) {
            toast.error("Failed to load platform data")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (user) loadData()
    }, [user])

    const handleFund = async (id: number) => {
        setFundingId(id)
        try {
            await fundLoan(id)
            toast.success("Loan funded successfully! It is now active.")
            loadData()
        } catch (err) {
            toast.error("Failed to fund loan")
        } finally {
            setFundingId(null)
        }
    }

    if (!user || user.role !== 'lender') {
        return <div className="p-10 text-center">Unauthorized Access</div>
    }

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>

    const totalInvested = portfolio.reduce((sum, l) => sum + Number(l.principal), 0)

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-orange-100 pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 -mx-6 -mt-6 rounded-t-xl mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center shadow-md shadow-orange-200/50">
                        <span className="text-white font-bold sanskrit-text text-xl">धन</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-orange-950">Lender Marketplace</h2>
                        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest italic leading-none mt-1">Empowering Growth through Peer-to-Peer Capital</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-orange-900">{user.name}</p>
                        <p className="text-[10px] text-orange-400 uppercase font-black tracking-tighter tracking-[0.2em] leading-none">Capital Partner</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-bold gap-2 border border-orange-100/50">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-orange-500 text-white border-none shadow-xl shadow-orange-500/10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Coins className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-orange-50 uppercase tracking-[0.2em] flex items-center gap-2">
                            Portfolio Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">₹{totalInvested.toLocaleString()}</div>
                        <p className="text-[10px] text-orange-100 mt-1 font-bold italic">{portfolio.length} active funding projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-orange-50 shadow-lg shadow-orange-500/5 group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <TrendingUp className="h-3 h-3" /> Potential Yield
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-orange-950 tracking-tighter">₹0</div>
                        <p className="text-[10px] text-orange-400 font-bold mt-1">Aggregate interest earned to date</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-orange-50 shadow-lg shadow-orange-500/5 group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Search className="h-3 h-3" /> Peer Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-orange-950 tracking-tighter">{availableLoans.length}</div>
                        <p className="text-[10px] text-orange-400 font-bold mt-1">Loan applications awaiting capital</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-black text-orange-950 flex items-center gap-2 uppercase tracking-tighter">
                            <Search className="h-5 w-5 text-orange-500" /> Market Opportunities
                        </h3>
                        <Badge className="bg-orange-50 text-orange-500 border-none text-[8px] font-black uppercase tracking-widest">REAL-TIME</Badge>
                    </div>
                    {availableLoans.length === 0 ? (
                        <Card className="p-16 text-center border-dashed border-2 border-orange-100 bg-orange-50/10 text-orange-300 italic">
                            No active requests waiting for funding.
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {availableLoans.map(loan => (
                                <Card key={loan.id} className="border-orange-50 shadow-md group hover:shadow-xl transition-all overflow-hidden border-2">
                                    <div className="h-1 bg-orange-400 group-hover:h-2 transition-all" />
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-md font-black text-orange-950">Peer Account: {loan.borrower_name}</CardTitle>
                                                <CardDescription className="text-xs font-bold text-orange-400 mt-1 italic italic">"{loan.loan_purpose}"</CardDescription>
                                            </div>
                                            <Badge className="bg-orange-500 text-white font-black text-[10px] border-none shadow-sm">12% ROI</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-6">
                                        <div className="flex items-end gap-1">
                                            <span className="text-3xl font-black text-orange-950 tracking-tighter leading-none">₹{Number(loan.principal).toLocaleString()}</span>
                                            <span className="text-[10px] font-black text-orange-300 mb-1 uppercase tracking-widest">Capital Needed</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-orange-50 border-dashed">
                                            <div>
                                                <p className="text-[8px] font-black text-orange-300 uppercase tracking-[0.2em] mb-1">Expected Return</p>
                                                <p className="text-sm font-black text-orange-900 leading-none">₹{(Number(loan.principal) * 0.12).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-orange-300 uppercase tracking-[0.2em] mb-1">Repayment Term</p>
                                                <p className="text-sm font-black text-orange-900 leading-none">12 Months</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-orange-50/30 border-t border-orange-50/50 pt-4 pb-4">
                                        <Button
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black shadow-xl shadow-orange-500/10 py-7 text-sm rounded-xl transition-all transform active:scale-95 group-active:translate-y-1"
                                            onClick={() => handleFund(loan.id!)}
                                            disabled={fundingId === loan.id}
                                        >
                                            {fundingId === loan.id ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="animate-spin w-5 h-5" /> Processing Transfer...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-3">
                                                    Invest in Peer <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-black text-orange-950 flex items-center gap-2 uppercase tracking-tighter">
                            <History className="h-5 w-5 text-orange-400" /> Portfolio Activity
                        </h3>
                    </div>
                    {portfolio.length === 0 ? (
                        <Card className="p-16 text-center border-dashed border-2 border-orange-100 bg-orange-50/10 text-orange-300 italic">
                            You haven't funded any loans yet.
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {portfolio.map(loan => (
                                <Card key={loan.id} className="border-orange-50 shadow-sm hover:shadow-lg transition-all group overflow-hidden border-2">
                                    <CardContent className="p-0 flex justify-between items-center group-hover:bg-orange-50/40 transition-colors">
                                        <div className="flex items-center gap-4 p-5">
                                            <div className="w-12 h-12 bg-orange-100/50 rounded-2xl flex items-center justify-center text-orange-400 font-black text-xs shadow-inner uppercase tracking-tighter scale-90 group-hover:scale-100 transition-transform">
                                                Active
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-orange-950 uppercase tracking-tighter">Investment #DHP-{loan.id?.toString().padStart(4, '0')}</p>
                                                <p className="text-[10px] font-bold text-orange-400 uppercase flex items-center gap-1 mt-0.5">
                                                    ₹{Number(loan.principal).toLocaleString()} <span className="opacity-40 font-black">|</span> {loan.interest_rate}% Yield
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pr-6">
                                            <Badge className="bg-orange-50 text-orange-500 border-none text-[8px] px-3 py-1 font-black uppercase flex items-center gap-1 shadow-sm">
                                                <CheckCircle className="h-2.5 w-2.5" /> FUNDED
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
