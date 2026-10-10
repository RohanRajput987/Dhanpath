"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { registerUser } from "@/lib/api"
import { Loader2, UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<"borrower" | "lender">("borrower")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await registerUser({ name, email, password, role })
            toast.success("Account created successfully!")
            router.push("/login")
        } catch (err) {
            toast.error("Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#d97706] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-2xl font-bold text-white sanskrit-text">धन</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] mb-0.5 tracking-tight">DhanPath</h1>
                    <p className="text-lg sanskrit-text text-[#666] font-medium mb-1">धनपथ</p>
                    <p className="text-[10px] text-[#666] font-medium uppercase tracking-widest">Join our financial ecosystem</p>
                </div>

                <Card className="bg-[#f2f0e4] border-white/50 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 pt-8">
                        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Create Account</CardTitle>
                        <CardDescription className="text-[#666] text-sm">Join the peer-to-peer lending revolution</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[#1a1a1a] font-medium text-sm">Full Name</Label>
                                <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 border-[#dcd9c6] rounded-xl focus-visible:ring-[#d97706]/20 bg-white shadow-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#1a1a1a] font-medium text-sm">Email Address</Label>
                                <Input id="email" type="email" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 border-[#dcd9c6] rounded-xl focus-visible:ring-[#d97706]/20 bg-white shadow-sm" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="password" className="text-[#1a1a1a] font-medium text-sm">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11 border-[#dcd9c6] rounded-xl focus-visible:ring-[#d97706]/20 bg-white pr-10 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#d97706]"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-[#1a1a1a] font-medium text-sm">I want to join as a</Label>
                                <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-xl border border-[#dcd9c6] cursor-pointer hover:border-[#d97706]/50 shadow-sm">
                                        <RadioGroupItem value="borrower" id="borrower" className="text-[#d97706] border-[#d97706]" />
                                        <Label htmlFor="borrower" className="text-xs font-bold text-[#1a1a1a] cursor-pointer">BORROWER</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-xl border border-[#dcd9c6] cursor-pointer hover:border-[#d97706]/50 shadow-sm">
                                        <RadioGroupItem value="lender" id="lender" className="text-[#d97706] border-[#d97706]" />
                                        <Label htmlFor="lender" className="text-xs font-bold text-[#1a1a1a] cursor-pointer">LENDER</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button type="submit" className="w-full bg-[#d97706] hover:bg-[#c2410c] text-white shadow-lg py-6 rounded-xl text-md font-bold transition-all mt-4 flex items-center justify-center gap-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Complete Registration
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>

                            <div className="pt-6 border-t border-[#dcd9c6] text-center text-sm text-[#666] mt-4">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#d97706] hover:underline font-bold">
                                    Login here
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
