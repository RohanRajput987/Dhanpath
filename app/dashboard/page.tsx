"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  Moon,
  Sun,
  Phone,
  MapPin,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { fetchBorrowers } from "@/lib/api"
import type { Borrower } from "@/lib/borrower-storage"

// Mock data - update the borrowers array
// const borrowers = [
//   {
//     id: 1,
//     name: "राजेश कुमार",
//     nameEn: "Rajesh Kumar",
//     avatar: "/placeholder.svg?height=40&width=40",
//     profession: "Shopkeeper",
//     mobile: "+91 98765 43210",
//     address: "Shop No. 15, Main Market, Karol Bagh, Delhi - 110005",
//     totalLoan: 50000,
//     paidAmount: 35000,
//     pendingAmount: 15000,
//     interestRate: 24,
//     nextDueDate: "2024-01-15",
//     status: "active",
//     riskLevel: "low",
//   },
//   {
//     id: 2,
//     name: "सुनीता देवी",
//     nameEn: "Sunita Devi",
//     avatar: "/placeholder.svg?height=40&width=40",
//     profession: "Tailor",
//     mobile: "+91 87654 32109",
//     address: "House No. 42, Sector 12, Rohini, Delhi - 110085",
//     totalLoan: 25000,
//     paidAmount: 25000,
//     pendingAmount: 0,
//     interestRate: 30,
//     nextDueDate: null,
//     status: "completed",
//     riskLevel: "low",
//   },
//   {
//     id: 3,
//     name: "अमित शर्मा",
//     nameEn: "Amit Sharma",
//     avatar: "/placeholder.svg?height=40&width=40",
//     profession: "Auto Driver",
//     mobile: "+91 76543 21098",
//     address: "Flat 201, Shanti Apartments, Laxmi Nagar, Delhi - 110092",
//     totalLoan: 75000,
//     paidAmount: 20000,
//     pendingAmount: 55000,
//     interestRate: 36,
//     nextDueDate: "2024-01-10",
//     status: "overdue",
//     riskLevel: "high",
//   },
// ]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [borrowers, setBorrowers] = useState<Borrower[]>([])

  useEffect(() => {
    fetchBorrowers().then(setBorrowers)
  }, [])

  const totalLent = borrowers.reduce((sum, b) => sum + b.totalLoan, 0)
  const totalCollected = borrowers.reduce((sum, b) => sum + b.paidAmount, 0)
  const totalPending = borrowers.reduce((sum, b) => sum + b.pendingAmount, 0)
  const activeBorrowers = borrowers.filter((b) => b.status === "active").length

  const filteredBorrowers = borrowers.filter(
    (borrower) =>
      borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.profession.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground sanskrit-text">धन</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">DhanPath</h1>
                <p className="text-sm text-muted-foreground sanskrit-text">धनपथ</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lent</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalLent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across {borrowers.length} borrowers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalLent ? ((totalCollected / totalLent) * 100).toFixed(1) : "0.0"}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalLent ? ((totalPending / totalLent) * 100).toFixed(1) : "0.0"}% remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Borrowers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBorrowers}</div>
              <p className="text-xs text-muted-foreground">Currently lending</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search borrowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => router.push("/borrowers/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Borrower
            </Button>
          </div>
        </div>

        {/* Borrowers List */}
        <Card>
          <CardHeader>
            <CardTitle>Borrowers Overview</CardTitle>
            <CardDescription>Manage and track all your lending relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBorrowers.map((borrower) => (
                <Link key={borrower.id} href={`/borrowers/${borrower.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={borrower.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {borrower.nameEn
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{borrower.nameEn}</h3>
                          <span className="text-sm text-muted-foreground sanskrit-text">({borrower.name})</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{borrower.profession}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{borrower.mobile}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{borrower.address}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              borrower.status === "completed"
                                ? "default"
                                : borrower.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {borrower.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{borrower.interestRate}% interest</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">₹{borrower.pendingAmount.toLocaleString()} pending</div>
                      <div className="text-xs text-muted-foreground">
                        of ₹{borrower.totalLoan.toLocaleString()} total
                      </div>
                      <Progress value={borrower.totalLoan ? (borrower.paidAmount / borrower.totalLoan) * 100 : 0} className="w-20 h-2" />
                      {borrower.nextDueDate && (
                        <div className="text-xs text-orange-600">
                          Due: {new Date(borrower.nextDueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
