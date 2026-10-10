"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, User, FileText, IndianRupee } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createBorrower } from "@/lib/api"

export default function AddBorrowerPage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [gender, setGender] = useState("")
  const [paymentFrequency, setPaymentFrequency] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const newBorrower = await createBorrower({
        nameEn: formData.get("nameEn") as string,
        name: formData.get("nameHi") as string,
        mobile: formData.get("phone") as string,
        email: formData.get("email") as string,
        profession: formData.get("profession") as string,
        address: formData.get("address") as string,
        aadhaar: formData.get("aadhaar") as string,
        pan: formData.get("pan") as string,
        fatherName: formData.get("fatherName") as string,
        dob: formData.get("dob") as string,
        gender: gender,
        emergencyContact: formData.get("emergencyContact") as string,
        totalLoan: Number(formData.get("loanAmount")),
        interestRate: Number(formData.get("interestRate")),
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        paymentFrequency: paymentFrequency,
        collateral: formData.get("collateral") as string,
        purpose: formData.get("purpose") as string,
      })

      setIsLoading(false)
      toast({
        title: "Borrower Added Successfully!",
        description: `${newBorrower.nameEn} has been added to your lending portfolio.`,
      })
      router.push("/dashboard")
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to add borrower. Please try again.",
        variant: "destructive",
      })
    }
  }

  const validateCurrentTab = () => {
    const form = document.querySelector("form") as HTMLFormElement
    const formData = new FormData(form)

    switch (activeTab) {
      case "personal":
        return formData.get("nameEn") && formData.get("phone") && formData.get("profession") && formData.get("address")
      case "kyc":
        return formData.get("aadhaar") && formData.get("pan") && formData.get("dob")
      case "loan":
        return (
          formData.get("loanAmount") &&
          formData.get("interestRate") &&
          formData.get("startDate") &&
          formData.get("endDate")
        )
      case "documents":
        return true // Documents are optional for now
      default:
        return true
    }
  }

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
                <h1 className="text-xl font-bold">Add New Borrower</h1>
                <p className="text-sm text-muted-foreground">Create a new lending relationship</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="kyc">KYC Details</TabsTrigger>
              <TabsTrigger value="loan">Loan Terms</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Basic details about the borrower</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">Full Name (English)</Label>
                      <Input id="nameEn" name="nameEn" placeholder="Rajesh Kumar" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameHi">नाम (हिंदी में)</Label>
                      <Input id="nameHi" name="nameHi" placeholder="राजेश कुमार" className="sanskrit-text" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="rajesh@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession/Business</Label>
                    <Input id="profession" name="profession" placeholder="Shopkeeper, Tailor, etc." required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Shop No. 15, Main Market, Delhi - 110001"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    KYC Information
                  </CardTitle>
                  <CardDescription>Identity and verification details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input id="aadhaar" name="aadhaar" placeholder="1234-5678-9012" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input id="pan" name="pan" placeholder="ABCDE1234F" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" name="fatherName" placeholder="Father's full name" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" name="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input id="emergencyContact" name="emergencyContact" placeholder="+91 98765 43210" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Loan Terms & Conditions
                  </CardTitle>
                  <CardDescription>Define the lending agreement details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                      <Input id="loanAmount" name="loanAmount" type="number" placeholder="50000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                      <Input id="interestRate" name="interestRate" type="number" placeholder="24" step="0.1" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Loan Start Date</Label>
                      <Input id="startDate" name="startDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Expected End Date</Label>
                      <Input id="endDate" name="endDate" type="date" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <Select name="paymentFrequency" value={paymentFrequency} onValueChange={setPaymentFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="halfyearly">Half-Yearly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collateral">Collateral Details (if any)</Label>
                    <Textarea
                      id="collateral"
                      name="collateral"
                      placeholder="Gold jewelry (50g), Property documents, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Loan Purpose</Label>
                    <Textarea id="purpose" name="purpose" placeholder="Business expansion, medical emergency, etc." />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Document Upload
                  </CardTitle>
                  <CardDescription>Upload KYC and loan-related documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Identity Documents</h4>
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Aadhaar Card</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">PAN Card</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Additional Documents</h4>
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Address Proof</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Income Proof</p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Loan Agreement Document</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const tabs = ["personal", "kyc", "loan", "documents"]
                const currentIndex = tabs.indexOf(activeTab)
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1])
                }
              }}
              disabled={activeTab === "personal"}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {activeTab !== "documents" ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateCurrentTab()) {
                      const tabs = ["personal", "kyc", "loan", "documents"]
                      const currentIndex = tabs.indexOf(activeTab)
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1])
                      }
                    } else {
                      toast({
                        title: "Incomplete Information",
                        description: "Please fill in all required fields before proceeding",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Borrower..." : "Create Borrower"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
