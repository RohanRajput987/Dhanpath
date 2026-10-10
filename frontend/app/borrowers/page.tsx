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
import { fetchBorrowers, Borrower } from "@/lib/api"
import { Loader2, Plus, Phone, Mail, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function BorrowersPage() {
    const [borrowers, setBorrowers] = useState<Borrower[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchBorrowers()
                setBorrowers(data)
            } catch (err) {
                toast.error("Failed to load borrowers")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

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
                    <h1 className="text-3xl font-bold tracking-tight">Borrowers</h1>
                    <p className="text-muted-foreground">Manage your lending relationships.</p>
                </div>
                <Button onClick={() => router.push("/borrowers/add")} className="bg-emerald-600 hover:bg-emerald-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Borrower
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Relationship Directory</CardTitle>
                    <CardDescription>All active and past borrowers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {borrowers.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell className="font-medium">{b.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            {b.phone || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {b.email || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(b.created_at!).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => router.push(`/borrowers/${b.id}`)}>
                                            View History
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {borrowers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No borrowers found. Start by adding one.
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
