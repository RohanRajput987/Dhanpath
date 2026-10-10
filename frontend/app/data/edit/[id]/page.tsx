"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchData, updateData, AnalyticsData } from "@/lib/api"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"

export default function EditDataPage() {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        category: "",
        value: "",
        label: ""
    })
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadRecord = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/data/${id}`)
                if (!response.ok) throw new Error("Failed to fetch record")
                const data: AnalyticsData = await response.json()
                setFormData({
                    category: data.category,
                    value: data.value.toString(),
                    label: data.label
                })
            } catch (err) {
                toast.error("Failed to load record")
                router.push("/data/table")
            } finally {
                setFetching(false)
            }
        }
        loadRecord()
    }, [id, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.category || !formData.value || !formData.label) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        try {
            await updateData(parseInt(id as string), {
                category: formData.category,
                value: parseInt(formData.value),
                label: formData.label
            })
            toast.success("Data updated successfully")
            router.push("/data/table")
        } catch (err) {
            toast.error("Failed to update data")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading Record...</span>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Record</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Data Entry</CardTitle>
                        <CardDescription>Update details for record #{id}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. Electronics, Clothing"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="label">Label / Period</Label>
                            <Input
                                id="label"
                                placeholder="e.g. Jan, Feb, Q1"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Value</Label>
                            <Input
                                id="value"
                                type="number"
                                placeholder="e.g. 500"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Update Record
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
