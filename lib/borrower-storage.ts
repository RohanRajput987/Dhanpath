// Simple client-side storage for borrowers (in a real app, this would be a database)
export interface Borrower {
  id: number
  name: string
  nameEn: string
  avatar?: string
  profession: string
  mobile: string
  address: string
  email?: string
  aadhaar: string
  pan: string
  totalLoan: number
  paidAmount: number
  pendingAmount: number
  interestRate: number
  startDate: string
  endDate: string
  nextDueDate: string
  status: "active" | "completed" | "overdue"
  riskLevel: "low" | "medium" | "high"
  collateral?: string
  monthlyInterest: number
  fatherName?: string
  dob?: string
  gender?: string
  emergencyContact?: string
  paymentFrequency?: string
  purpose?: string
}

const STORAGE_KEY = "dhanpath_borrowers"

// Default borrowers
const defaultBorrowers: Borrower[] = [
  {
    id: 1,
    name: "राजेश कुमार",
    nameEn: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    profession: "Shopkeeper",
    mobile: "+91 98765 43210",
    address: "Shop No. 15, Main Market, Karol Bagh, Delhi - 110005",
    email: "rajesh@example.com",
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
  },
  {
    id: 2,
    name: "सुनीता देवी",
    nameEn: "Sunita Devi",
    avatar: "/placeholder.svg?height=40&width=40",
    profession: "Tailor",
    mobile: "+91 87654 32109",
    address: "House No. 42, Sector 12, Rohini, Delhi - 110085",
    email: "sunita@example.com",
    aadhaar: "2345-6789-0123",
    pan: "BCDEF2345G",
    totalLoan: 25000,
    paidAmount: 25000,
    pendingAmount: 0,
    interestRate: 30,
    startDate: "2023-03-10",
    endDate: "2024-03-10",
    nextDueDate: "",
    status: "completed",
    riskLevel: "low",
    collateral: "Silver Ornaments",
    monthlyInterest: 625,
  },
  {
    id: 3,
    name: "अमित शर्मा",
    nameEn: "Amit Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    profession: "Auto Driver",
    mobile: "+91 76543 21098",
    address: "Flat 201, Shanti Apartments, Laxmi Nagar, Delhi - 110092",
    email: "amit@example.com",
    aadhaar: "3456-7890-1234",
    pan: "CDEFG3456H",
    totalLoan: 75000,
    paidAmount: 20000,
    pendingAmount: 55000,
    interestRate: 36,
    startDate: "2023-08-20",
    endDate: "2024-08-20",
    nextDueDate: "2024-01-10",
    status: "overdue",
    riskLevel: "high",
    collateral: "Vehicle RC",
    monthlyInterest: 2250,
  },
]

export function getBorrowers(): Borrower[] {
  if (typeof window === "undefined") return defaultBorrowers

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBorrowers))
    return defaultBorrowers
  }

  return JSON.parse(stored)
}

export function addBorrower(borrowerData: Partial<Borrower>): Borrower {
  const borrowers = getBorrowers()
  const newId = Math.max(...borrowers.map((b) => b.id), 0) + 1

  const newBorrower: Borrower = {
    id: newId,
    name: borrowerData.name || borrowerData.nameEn || "",
    nameEn: borrowerData.nameEn || "",
    profession: borrowerData.profession || "",
    mobile: borrowerData.mobile || "",
    address: borrowerData.address || "",
    email: borrowerData.email,
    aadhaar: borrowerData.aadhaar || "",
    pan: borrowerData.pan || "",
    totalLoan: borrowerData.totalLoan || 0,
    paidAmount: 0,
    pendingAmount: borrowerData.totalLoan || 0,
    interestRate: borrowerData.interestRate || 0,
    startDate: borrowerData.startDate || new Date().toISOString().split("T")[0],
    endDate: borrowerData.endDate || new Date().toISOString().split("T")[0],
    nextDueDate: borrowerData.startDate || new Date().toISOString().split("T")[0],
    status: "active",
    riskLevel: "low",
    collateral: borrowerData.collateral,
    monthlyInterest: Math.round(((borrowerData.totalLoan || 0) * (borrowerData.interestRate || 0)) / 100 / 12),
    fatherName: borrowerData.fatherName,
    dob: borrowerData.dob,
    gender: borrowerData.gender,
    emergencyContact: borrowerData.emergencyContact,
    paymentFrequency: borrowerData.paymentFrequency,
    purpose: borrowerData.purpose,
  }

  borrowers.push(newBorrower)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(borrowers))

  return newBorrower
}

export function getBorrowerById(id: number): Borrower | undefined {
  const borrowers = getBorrowers()
  return borrowers.find((b) => b.id === id)
}
