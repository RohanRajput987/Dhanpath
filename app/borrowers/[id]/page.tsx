"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { fetchBorrower } from "@/lib/api"
import type { Borrower } from "@/lib/borrower-storage"

// Mock borrower data - update the borrowerData object
const defaultBorrowerData = {
  id: 1,
  name: "राजेश कुमार",
  nameEn: "Rajesh Kumar",
  avatar: "/placeholder.svg?height=80&width=80",
  profession: "Shopkeeper",
  phone: "+91 98765 43210",
  email: "rajesh@example.com",
  address: "Shop No. 15, Main Market, Karol Bagh, Delhi - 110005",
  aadhaar: "1234-5678-9012",
  pan: "ABCDE1234F",
  totalLoan: 50000,
  paidAmount: 35000,
  pendingAmount: 15000,
  interestRate: 24,
  startDate: "2023-06-15",
  endDate: "2024-06-15",
  nextDueDate: "2024-01-15",
  status: "active",
  riskLevel: "low",
  collateral: "Gold Jewelry (50g)",
  monthlyInterest: 1000,
  paymentHistory: [
    { date: "2023-12-15", amount: 5000, type: "principal", status: "paid" },
    { date: "2023-12-15", amount: 1000, type: "interest", status: "paid" },
    { date: "2023-11-15", amount: 1000, type: "interest", status: "paid" },
    { date: "2023-10-15", amount: 10000, type: "principal", status: "paid" },
    { date: "2023-10-15", amount: 1000, type: "interest", status: "paid" },
    { date: "2024-01-15", amount: 1000, type: "interest", status: "pending" },
  ],
  documents: [
    { name: "Aadhaar Card", type: "identity", uploaded: true },
    { name: "PAN Card", type: "identity", uploaded: true },
    { name: "Address Proof", type: "address", uploaded: false },
    { name: "Income Proof", type: "financial", uploaded: true },
  ],
}

function toDetailBorrower(borrower: Borrower) {
  return {
    ...defaultBorrowerData,
    id: borrower.id,
    name: borrower.name || borrower.nameEn,
    nameEn: borrower.nameEn || borrower.name,
    avatar: borrower.avatar || "/placeholder.svg?height=80&width=80",
    profession: borrower.profession,
    phone: borrower.mobile,
    email: borrower.email || "",
    address: borrower.address,
    aadhaar: borrower.aadhaar,
    pan: borrower.pan,
    totalLoan: borrower.totalLoan,
    paidAmount: borrower.paidAmount,
    pendingAmount: borrower.pendingAmount,
    interestRate: borrower.interestRate,
    startDate: borrower.startDate,
    endDate: borrower.endDate,
    nextDueDate: borrower.nextDueDate || borrower.endDate,
    status: borrower.status,
    riskLevel: borrower.riskLevel,
    collateral: borrower.collateral || "",
    monthlyInterest: borrower.monthlyInterest,
  }
}

export default function BorrowerDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [borrowerData, setBorrowerData] = useState(defaultBorrowerData)

  useEffect(() => {
    const id = Number(params.id)
    if (!Number.isFinite(id)) return

    fetchBorrower(id).then((borrower) => {
      if (!borrower) return

      setBorrowerData(toDetailBorrower(borrower))
    })
  }, [params.id])

  const completionPercentage = borrowerData.totalLoan ? (borrowerData.paidAmount / borrowerData.totalLoan) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Borrower Details</h1>
                <p className="text-sm text-muted-foreground">Complete lending information</p>
              </div>
            </div>

            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Borrower Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={borrowerData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {borrowerData.nameEn
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{borrowerData.nameEn}</h2>
                    <span className="text-lg text-muted-foreground sanskrit-text">({borrowerData.name})</span>
                    <Badge
                      variant={
                        borrowerData.status === "completed"
                          ? "default"
                          : borrowerData.status === "overdue"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {borrowerData.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{borrowerData.profession}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{borrowerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{borrowerData.email}</span>
                  </div>
                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{borrowerData.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Loan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{borrowerData.totalLoan.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Principal amount</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{borrowerData.paidAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{completionPercentage.toFixed(1)}% completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₹{borrowerData.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Remaining balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{borrowerData.interestRate}%</div>
              <p className="text-xs text-muted-foreground">Annual rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Loan Progress</span>
                <span>{completionPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>₹{borrowerData.totalLoan.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={borrowerData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {borrowerData.nameEn
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{borrowerData.nameEn}</div>
                      <div className="text-sm text-muted-foreground sanskrit-text">({borrowerData.name})</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Mobile</div>
                        <div className="text-sm text-muted-foreground">{borrowerData.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <div className="text-sm font-medium">Address</div>
                        <div className="text-sm text-muted-foreground">{borrowerData.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">{borrowerData.email}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{new Date(borrowerData.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{new Date(borrowerData.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Interest:</span>
                    <span>₹{borrowerData.monthlyInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Due:</span>
                    <span className="text-orange-600">{new Date(borrowerData.nextDueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collateral:</span>
                    <span>{borrowerData.collateral}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>KYC Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aadhaar:</span>
                    <span>{borrowerData.aadhaar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PAN:</span>
                    <span>{borrowerData.pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <Badge variant={borrowerData.riskLevel === "low" ? "default" : "destructive"}>
                      {borrowerData.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profession:</span>
                    <span>{borrowerData.profession}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {borrowerData.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {payment.status === "paid" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <div className="font-medium">
                            ₹{payment.amount.toLocaleString()} ({payment.type})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={payment.status === "paid" ? "default" : "secondary"}>{payment.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">KYC Documents</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowerData.documents.map((doc, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{doc.type}</div>
                        </div>
                      </div>
                      {doc.uploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Loan Timeline</CardTitle>
                <CardDescription>Track the complete journey of this loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Loan Sanctioned</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(borrowerData.startDate).toLocaleDateString()} - ₹
                        {borrowerData.totalLoan.toLocaleString()} approved
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Payments Received</div>
                      <div className="text-sm text-muted-foreground">
                        ₹{borrowerData.paidAmount.toLocaleString()} collected so far
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Next Payment Due</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(borrowerData.nextDueDate).toLocaleDateString()} - ₹
                        {borrowerData.monthlyInterest.toLocaleString()} interest
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
