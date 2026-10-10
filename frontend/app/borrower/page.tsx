"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, PlusCircle, CreditCard, Clock, CheckCircle2, Loader2, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { fetchMyLoans, requestLoan, Loan } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function BorrowerDashboard() {
    const { user, logout } = useAuth()
    const [loans, setLoans] = React.useState<Loan[]>([])
    const [loading, setLoading] = React.useState(true)
    const [requesting, setRequesting] = React.useState(false)

    // Form state
    const [showForm, setShowForm] = React.useState(false)
    const [formData, setFormData] = React.useState({
        principal: "",
        interest_rate: "12",
        loan_purpose: "",
        notes: ""
    })

    const loadLoans = async () => {
        try {
            const data = await fetchMyLoans()
            setLoans(data)
        } catch (err) {
            toast.error("Failed to load your loans")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (user) loadLoans()
    }, [user])

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setRequesting(true)
        try {
            await requestLoan({
                principal: parseFloat(formData.principal),
                interest_rate: parseFloat(formData.interest_rate),
                loan_purpose: formData.loan_purpose,
                notes: formData.notes
            })
            toast.success("Loan request submitted for review!")
            setShowForm(false)
            loadLoans()
        } catch (err) {
            toast.error("Failed to submit request")
        } finally {
            setRequesting(false)
        }
    }

    if (!user || user.role !== 'borrower') {
        return <div className="p-10 text-center">Unauthorized Access</div>
    }

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>

    const totalDebt = loans.filter(l => l.status === 'active').reduce((sum, l) => sum + Number(l.principal), 0)

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-orange-100 pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 -mx-6 -mt-6 rounded-t-xl mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center shadow-md shadow-orange-200/50">
                        <span className="text-white font-bold sanskrit-text text-xl">धन</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-orange-950">Borrower Dashboard</h1>
                        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-1 italic leading-none">Your Path to Financial Growth</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-orange-900">{user.name}</p>
                        <p className="text-[10px] text-orange-400 uppercase font-black tracking-tighter tracking-[0.2em] leading-none">Verified Borrower</p>
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
                        <IndianRupee className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-orange-50 uppercase tracking-[0.2em]">Total Active Debt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">₹{totalDebt.toLocaleString()}</div>
                        <p className="text-[10px] text-orange-100 mt-1 font-bold italic">Active across {loans.filter(l => l.status === 'active').length} loans</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-orange-50 shadow-lg shadow-orange-500/5 group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Requested Capital</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-orange-950 tracking-tighter">{loans.length}</div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-orange-400 font-bold">
                            <Clock className="w-3 h-3" />
                            {loans.filter(l => l.status === 'pending').length} applications awaiting review
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50/10 border-orange-100/50 shadow-sm border-dashed">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-orange-300 uppercase tracking-[0.2em]">Platform Trust Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-black text-orange-800 tracking-tighter uppercase">Excellent</div>
                            <Badge className="bg-orange-500 text-white border-none text-[8px] h-4 font-black">VERIFIED</Badge>
                        </div>
                        <p className="text-[10px] text-orange-400 font-bold mt-1">Based on previous behavior</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    {showForm ? (
                        <Card className="border-orange-50 shadow-xl shadow-orange-500/10 overflow-hidden border-2">
                            <CardHeader className="bg-orange-50/40 border-b border-orange-50 relative">
                                <CardTitle className="text-lg font-black text-orange-950">New Loan Request</CardTitle>
                                <CardDescription className="text-xs font-bold text-orange-400">Establish your capital requirements</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleRequest}>
                                <CardContent className="space-y-5 pt-8 px-6">
                                    <div className="space-y-2">
                                        <Label className="text-orange-900 font-black text-[10px] uppercase tracking-widest ml-1">Principal Amount (₹)</Label>
                                        <Input
                                            type="number"
                                            value={formData.principal}
                                            onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                                            placeholder="e.g. 50,000"
                                            required
                                            className="h-12 border-orange-100 rounded-xl focus-visible:ring-orange-400/30 bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-orange-900 font-black text-[10px] uppercase tracking-widest ml-1">Capital Purpose</Label>
                                        <Input
                                            value={formData.loan_purpose}
                                            onChange={(e) => setFormData({ ...formData, loan_purpose: e.target.value })}
                                            placeholder="Business, Education, Medical etc."
                                            required
                                            className="h-12 border-orange-100 rounded-xl focus-visible:ring-orange-400/30 bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-orange-900 font-black text-[10px] uppercase tracking-widest ml-1">Detailed Context</Label>
                                        <Input
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Help lenders understand your path..."
                                            className="h-12 border-orange-100 rounded-xl focus-visible:ring-orange-400/30 bg-white shadow-sm"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-3 pb-8 px-6 pt-4">
                                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black shadow-xl shadow-orange-500/10 py-7 rounded-xl text-md transition-all" disabled={requesting}>
                                        {requesting ? <Loader2 className="animate-spin w-5 h-5 mr-3" /> : "Initiate Request"}
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-orange-400 hover:text-orange-600 hover:bg-orange-50 font-black text-xs uppercase tracking-widest">Abort Process</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 border-orange-100 flex flex-col items-center justify-center p-16 text-center bg-orange-50/10 hover:bg-orange-50/30 transition-all cursor-pointer group rounded-3xl" onClick={() => setShowForm(true)}>
                            <div className="w-16 h-16 bg-orange-100/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <PlusCircle className="h-8 w-8 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-black text-orange-950 uppercase tracking-tighter">Need Capital?</h3>
                            <p className="text-[10px] text-orange-400 mt-2 mb-8 font-bold italic leading-relaxed px-4">Tap into the peer network for verified financial assistance.</p>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/10 px-10 py-6 rounded-xl font-black">Request Loan</Button>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-black text-orange-950 uppercase tracking-tighter">My Loan Applications</h3>
                        <Badge className="bg-orange-50 text-orange-400 border-none text-[8px] font-black uppercase tracking-widest">PEER REVIEW</Badge>
                    </div>
                    {loans.length === 0 ? (
                        <Card className="p-16 text-center text-orange-300 italic border-dashed border-2 border-orange-100 bg-orange-50/10 rounded-3xl">
                            No loan history yet. Start your first journey!
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {loans.map(loan => (
                                <Card key={loan.id} className="overflow-hidden shadow-md group hover:shadow-xl transition-all border-orange-50 border-2 rounded-2xl">
                                    <CardHeader className="py-4 bg-white group-hover:bg-orange-50/40 transition-colors border-b border-orange-50 border-dashed">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-400">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-orange-300 tracking-tighter leading-none">Application Path</p>
                                                    <p className="text-xs font-black text-orange-900 mt-0.5">#DHP-{loan.id?.toString().padStart(4, '0') || '0000'}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                className={`capitalize px-3 py-1 text-[8px] font-black border-none shadow-sm ${loan.status === 'active' ? 'bg-orange-500 text-white' :
                                                    loan.status === 'pending' ? 'bg-amber-100 text-amber-900' :
                                                        'bg-orange-50 text-orange-400'
                                                    }`}
                                            >
                                                {loan.status === 'active' ? (
                                                    <span className="flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> FUNDED</span>
                                                ) : (
                                                    loan.status.replace('_', ' ').toUpperCase()
                                                )}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-8 pb-8 grid grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                                        <div>
                                            <p className="text-[8px] uppercase font-black text-orange-300 tracking-[0.2em] mb-2 leading-none">Principal</p>
                                            <p className="text-xl font-black text-orange-950 leading-none tracking-tighter">₹{Number(loan.principal).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] uppercase font-black text-orange-300 tracking-[0.2em] mb-2 leading-none">Interest</p>
                                            <p className="text-xl font-black text-orange-950 leading-none tracking-tighter">{loan.interest_rate}% <span className="text-[10px] opacity-40 font-bold tracking-normal italic uppercase">p/a</span></p>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <p className="text-[8px] uppercase font-black text-orange-300 tracking-[0.2em] mb-2 leading-none">Loan Objective</p>
                                            <p className="text-sm font-bold text-orange-900 mt-1 italic leading-relaxed">"{loan.loan_purpose}"</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="py-3 bg-orange-50/20 border-t border-orange-50/50 flex justify-between items-center px-6">
                                        <div className="flex items-center gap-2 text-[9px] text-orange-400 font-black leading-none uppercase tracking-wider">
                                            <Clock className="w-3 h-3" /> Requested: {new Date().toLocaleDateString()}
                                        </div>
                                        {loan.status === 'pending' && (
                                            <p className="text-[8px] text-amber-600 font-extrabold uppercase italic tracking-widest bg-amber-50 px-2 py-0.5 rounded-full">Pending Verification</p>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
