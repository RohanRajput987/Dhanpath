"use client"

import React, { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchLoans, Loan } from "@/lib/api"
import { Loader2, Plus, CircleDollarSign, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchLoans()
                setLoans(data)
            } catch (err) {
                toast.error("Failed to load loans")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge variant="outline" className="border-emerald-500 text-emerald-500">Active</Badge>
            case 'paid': return <Badge variant="outline" className="border-blue-500 text-blue-500">Paid</Badge>
            case 'default': return <Badge variant="destructive">Defaulted</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Loans</h1>
                    <p className="text-muted-foreground">Track your capital deployments.</p>
                </div>
                <Button onClick={() => router.push("/loans/add")} className="bg-emerald-600 hover:bg-emerald-700">
                    <CircleDollarSign className="mr-2 h-4 w-4" /> Issue New Loan
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Loan Ledger</CardTitle>
                    <CardDescription>Detailed overview of all lending transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Principal</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Date Given</TableHead>
                                <TableHead>Return Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans.map((l) => (
                                <TableRow key={l.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {l.borrower_photo ? "📸" : "👤"}
                                            {l.borrower_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{Number(l.principal).toLocaleString()}</TableCell>
                                    <TableCell>{l.interest_rate}%</TableCell>
                                    <TableCell>{getStatusBadge(l.status)}</TableCell>
                                    <TableCell className="capitalize text-xs font-semibold">{l.payment_frequency}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {new Date(l.start_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {l.due_date ? new Date(l.due_date).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {loans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No active loans.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
