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
import { fetchData, deleteData, AnalyticsData } from "@/lib/api"
import { Loader2, Trash2, Edit, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DataTablePage() {
    const [data, setData] = useState<AnalyticsData[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const loadData = async () => {
        try {
            const result = await fetchData()
            setData(result)
        } catch (err) {
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this record?")) {
            try {
                await deleteData(id)
                toast.success("Record deleted successfully")
                loadData()
            } catch (err) {
                toast.error("Failed to delete record")
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading Table...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Data Table</h1>
                    <p className="text-muted-foreground">Comprehensive view of all analytics records.</p>
                </div>
                <Button onClick={() => router.push("/data/add")}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Record
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analytics Records</CardTitle>
                    <CardDescription>Manage your data entries below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.label}</TableCell>
                                    <TableCell>{item.value}</TableCell>
                                    <TableCell>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => router.push(`/data/edit/${item.id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDelete(item.id!)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No records found.
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
