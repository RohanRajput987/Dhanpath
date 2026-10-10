"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Plus,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { fetchBorrowerById, fetchLoansByBorrowerId, Borrower, Loan } from "@/lib/api"
import { toast } from "sonner"

export default function BorrowerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const borrowerId = parseInt(params.id as string)

  const [borrower, setBorrower] = useState<Borrower | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bData, lData] = await Promise.all([
          fetchBorrowerById(borrowerId),
          fetchLoansByBorrowerId(borrowerId)
        ])
        setBorrower(bData)
        setLoans(lData)
      } catch (err) {
        toast.error("Failed to load borrower details")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [borrowerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!borrower) return <div className="p-10 text-center">Borrower not found</div>

  const totalPrincipal = loans.reduce((sum, loan) => sum + Number(loan.principal), 0)
  const activeLoansCount = loans.filter(l => l.status === 'active').length

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Borrower Details</h1>
            <p className="text-sm text-muted-foreground">Comprehensive financial history</p>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </header>

      {/* Profile Overview Card */}
      <Card className="border-emerald-100 dark:border-emerald-950/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-20 h-20 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-2 border-emerald-500/20">
              {borrower.photo ? (
                <img src={borrower.photo} alt={borrower.name} className="object-cover w-full h-full" />
              ) : (
                <AvatarFallback className="text-2xl font-bold">
                  {borrower.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold">{borrower.name}</h2>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200">
                    ID #{borrower.id}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Joined {new Date(borrower.created_at!).toLocaleDateString()}
                  </p>
                  {borrower.profession && (
                    <p className="flex items-center gap-1.5 border-l pl-4">
                      <Badge variant="secondary">{borrower.profession}</Badge>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Contact Details</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{borrower.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{borrower.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Family Detail</p>
                  <div className="text-sm font-medium">S/O: {borrower.father_name || 'N/A'}</div>
                  {borrower.father_phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {borrower.father_phone}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 pt-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider mb-1">Current Address</p>
                  <div className="flex items-start gap-2 text-sm leading-tight italic">
                    <MapPin className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                    <span>{borrower.address || 'No address provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Capital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPrincipal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total of {loans.length} loans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeLoansCount} Active</div>
            <p className="text-xs text-muted-foreground">Ongoing settlements</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 text-white">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Standard</div>
            <p className="text-xs opacity-75">Trust score: High</p>
          </CardContent>
        </Card>
      </div>

      {/* History Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Loan History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {loans.length > 0 ? (
            loans.map(loan => (
              <Card key={loan.id}>
                <CardHeader className="pb-3 border-b border-muted/30">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Loan #{loan.id}</CardTitle>
                      <CardDescription>Issued on {new Date(loan.start_date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge
                      variant={loan.status === 'active' ? 'outline' : 'default'}
                      className={loan.status === 'active' ? 'border-emerald-500 text-emerald-500' : ''}
                    >
                      {loan.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4 border-b border-muted/20">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Principal</p>
                      <p className="text-lg font-bold">₹{Number(loan.principal).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Interest</p>
                      <p className="text-lg font-bold">{loan.interest_rate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Interval</p>
                      <Badge variant="secondary" className="capitalize text-[10px]">{loan.payment_frequency}</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Repayment Date</p>
                      <p className="text-sm font-medium">{loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button size="sm" variant="ghost" className="h-8 text-xs">View Ledger</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Purpose</p>
                      <p className="text-sm">{loan.loan_purpose || 'Not specified'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Collateral</p>
                      <p className="text-sm italic">{loan.collateral || 'None'}</p>
                    </div>
                    {loan.borrower_photo && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Agreement Image</p>
                        <img src={loan.borrower_photo} alt="Agreement" className="h-20 w-32 object-cover rounded-md border shadow-sm" />
                      </div>
                    )}
                  </div>

                  {loan.reference_number && (
                    <div className="pt-2">
                      <Badge variant="outline" className="text-[9px] uppercase border-emerald-200 text-emerald-700">Ref: {loan.reference_number}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-xl text-muted-foreground">
              No loan history found for this borrower.
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Combined Payment Stream</CardTitle>
              <CardDescription>Aggregate view of all recoveries from this borrower.</CardDescription>
            </CardHeader>
            <CardContent className="py-20 text-center text-muted-foreground">
              Payment ledger is currently being migrated.
              Individual loan payments are visible in the "Loan History" tab under each loan.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
