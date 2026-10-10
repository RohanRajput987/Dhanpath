"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addLoan, fetchBorrowers, Borrower } from "@/lib/api"
import { Loader2, ArrowLeft, CircleDollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function IssueLoanPage() {
    const [borrowers, setBorrowers] = useState<Borrower[]>([])
    const [formData, setFormData] = useState({
        borrower_id: "",
        principal: "",
        interest_rate: "",
        start_date: new Date().toISOString().split('T')[0],
        due_date: "",
        collateral: "",
        reference_number: "",
        loan_purpose: "",
        borrower_photo: "",
        payment_frequency: "monthly",
        notes: ""
    })
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadBorrowers = async () => {
            try {
                const data = await fetchBorrowers()
                setBorrowers(data)
            } catch (err) {
                toast.error("Failed to load borrowers list")
            } finally {
                setFetching(false)
            }
        }
        loadBorrowers()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.borrower_id || !formData.principal || !formData.interest_rate) {
            toast.error("Please fill required fields")
            return
        }

        setLoading(true)
        try {
            await addLoan({
                borrower_id: parseInt(formData.borrower_id),
                principal: parseFloat(formData.principal),
                interest_rate: parseFloat(formData.interest_rate),
                start_date: formData.start_date,
                due_date: formData.due_date || undefined,
                collateral: formData.collateral,
                reference_number: formData.reference_number,
                loan_purpose: formData.loan_purpose,
                borrower_photo: formData.borrower_photo,
                payment_frequency: formData.payment_frequency as any,
                status: 'active',
                notes: formData.notes
            })
            toast.success("Loan issued successfully")
            router.push("/loans")
        } catch (err) {
            toast.error("Failed to issue loan")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Issue Loan</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Loan Configuration</CardTitle>
                        <CardDescription>Specify the terms of the lending agreement.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="borrower">Select Borrower</Label>
                            <Select onValueChange={(val) => setFormData({ ...formData, borrower_id: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chose a borrower..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {borrowers.map(b => (
                                        <SelectItem key={b.id} value={b.id!.toString()}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="principal">Principal Amount (₹)</Label>
                                <Input
                                    id="principal"
                                    type="number"
                                    value={formData.principal}
                                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                                <Input
                                    id="rate"
                                    type="number"
                                    value={formData.interest_rate}
                                    onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Start Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_date">Return Date (Optional)</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="collateral">Collateral / Security</Label>
                                <Input
                                    id="collateral"
                                    value={formData.collateral}
                                    onChange={(e) => setFormData({ ...formData, collateral: e.target.value })}
                                    placeholder="e.g. Gold, Vehicle, Land"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ref">Reference Number</Label>
                                <Input
                                    id="ref"
                                    value={formData.reference_number}
                                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                                    placeholder="Ref # or Agreement #"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="purpose">Purpose of Loan</Label>
                                <Input
                                    id="purpose"
                                    value={formData.loan_purpose}
                                    onChange={(e) => setFormData({ ...formData, loan_purpose: e.target.value })}
                                    placeholder="Why is the borrower taking this loan?"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Repayment Frequency</Label>
                                <Select
                                    value={formData.payment_frequency}
                                    onValueChange={(val) => setFormData({ ...formData, payment_frequency: val })}
                                >
                                    <SelectTrigger id="frequency">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                        <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="loan_photo">Borrower Photo (at time of loan)</Label>
                            <Input
                                id="loan_photo"
                                value={formData.borrower_photo}
                                onChange={(e) => setFormData({ ...formData, borrower_photo: e.target.value })}
                                placeholder="URL of photo taken during agreement"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Terms / Notes</Label>
                            <Input
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CircleDollarSign className="mr-2 h-4 w-4" />}
                            Execute Agreement
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
