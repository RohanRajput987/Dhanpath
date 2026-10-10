import { addBorrower as addLocalBorrower, getBorrowerById, getBorrowers, type Borrower } from "@/lib/borrower-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

type ApiBorrower = {
  id: number
  name: string
  father_name?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  profession?: string | null
  created_at?: string
}

type ApiLoan = {
  id: number
  borrower_id: number
  principal: number
  interest_rate: number
  start_date: string
  due_date?: string | null
  loan_purpose?: string | null
  status: "pending" | "active" | "paid" | "default"
}

export type BorrowerInput = Partial<Borrower>

export type AuthUser = {
  id: number
  name: string
  email: string
  role: "admin" | "lender" | "borrower"
}

function mapBorrower(apiBorrower: ApiBorrower, loans: ApiLoan[] = []): Borrower {
  const activeLoan = loans[0]
  const totalLoan = activeLoan?.principal ?? 0
  const interestRate = activeLoan?.interest_rate ?? 0

  return {
    id: apiBorrower.id,
    name: apiBorrower.name,
    nameEn: apiBorrower.name,
    avatar: "/placeholder.svg?height=40&width=40",
    profession: apiBorrower.profession || "",
    mobile: apiBorrower.phone || "",
    address: apiBorrower.address || "",
    email: apiBorrower.email || "",
    aadhaar: "",
    pan: "",
    totalLoan,
    paidAmount: 0,
    pendingAmount: totalLoan,
    interestRate,
    startDate: activeLoan?.start_date || new Date().toISOString().split("T")[0],
    endDate: activeLoan?.due_date || new Date().toISOString().split("T")[0],
    nextDueDate: activeLoan?.due_date || "",
    status: activeLoan?.status === "paid" ? "completed" : activeLoan?.status === "default" ? "overdue" : "active",
    riskLevel: "low",
    monthlyInterest: Math.round((totalLoan * interestRate) / 100 / 12),
    fatherName: apiBorrower.father_name || "",
    purpose: activeLoan?.loan_purpose || "",
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchBorrowers(): Promise<Borrower[]> {
  try {
    const borrowers = await request<ApiBorrower[]>("/borrowers")
    const loans = await request<ApiLoan[]>("/loans")

    return borrowers.map((borrower) => mapBorrower(borrower, loans.filter((loan) => loan.borrower_id === borrower.id)))
  } catch {
    return getBorrowers()
  }
}

export async function fetchBorrower(id: number): Promise<Borrower | undefined> {
  try {
    const borrower = await request<ApiBorrower>(`/borrowers/${id}`)
    const loans = await request<ApiLoan[]>(`/borrowers/${id}/loans`)
    return mapBorrower(borrower, loans)
  } catch {
    return getBorrowerById(id)
  }
}

export async function createBorrower(data: BorrowerInput): Promise<Borrower> {
  try {
    const borrower = await request<ApiBorrower>("/borrowers", {
      method: "POST",
      body: JSON.stringify({
        name: data.nameEn || data.name || "",
        father_name: data.fatherName || null,
        phone: data.mobile || null,
        email: data.email || null,
        address: data.address || null,
        profession: data.profession || null,
      }),
    })

    if (data.totalLoan && data.interestRate && data.startDate) {
      await request<ApiLoan>("/loans/request", {
        method: "POST",
        body: JSON.stringify({
          borrower_id: borrower.id,
          principal: data.totalLoan,
          interest_rate: data.interestRate,
          start_date: data.startDate,
          due_date: data.endDate || null,
          loan_purpose: data.purpose || null,
          status: "active",
        }),
      })
    }

    return fetchBorrower(borrower.id).then((created) => created || mapBorrower(borrower))
  } catch {
    return addLocalBorrower(data)
  }
}

export async function loginUser(credentials: { email: string; password: string }): Promise<{ token: string; user: AuthUser }> {
  const data = await request<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      name: credentials.email,
      email: credentials.email,
      password: credentials.password,
      role: "lender",
    }),
  })

  localStorage.setItem("dhanpath_token", data.token)
  localStorage.setItem("dhanpath_user", JSON.stringify(data.user))
  return data
}

export async function registerUser(user: { name: string; email: string; password: string; role?: AuthUser["role"] }): Promise<AuthUser> {
  return request<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role || "lender",
    }),
  })
}
