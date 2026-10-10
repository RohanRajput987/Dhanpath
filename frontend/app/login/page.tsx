"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Smartphone, Mail, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginMethod, setLoginMethod] = useState("email")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await login({ email, password })
            toast.success("स्वागतम् (Welcome)!", {
                description: "Successfully logged into DhanPath",
            })
        } catch (err) {
            toast.error("Login failed", {
                description: "Please check your credentials and try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#d97706] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-2xl font-bold text-white sanskrit-text">धन</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] mb-0.5 tracking-tight">DhanPath</h1>
                    <p className="text-lg sanskrit-text text-[#666] font-medium mb-1">धनपथ</p>
                    <p className="text-[10px] text-[#666] font-medium uppercase tracking-widest">Path of Wealth & Financial Wisdom</p>
                </div>

                <Card className="bg-[#f2f0e4] border-white/50 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 pt-8">
                        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Welcome Back</CardTitle>
                        <CardDescription className="text-[#666] text-sm">Sign in to your DhanPath account</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8">
                        <Tabs value={loginMethod} onValueChange={setLoginMethod} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 bg-[#e5e3d5] p-1 rounded-xl">
                                <TabsTrigger value="mobile" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1a1a1a] transition-all text-[#666]">
                                    <Smartphone className="w-4 h-4" />
                                    Mobile
                                </TabsTrigger>
                                <TabsTrigger value="email" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1a1a1a] transition-all text-[#666]">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </TabsTrigger>
                            </TabsList>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <TabsContent value="mobile" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="mobile" className="text-[#1a1a1a] font-medium text-sm">Mobile Number</Label>
                                        <Input id="mobile" type="tel" placeholder="+91 98765 43210" disabled className="h-12 border-[#dcd9c6] rounded-xl focus-visible:ring-[#d97706]/20 bg-white" />
                                    </div>
                                </TabsContent>

                                <TabsContent value="email" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#1a1a1a] font-medium text-sm">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 border-[#dcd9c6] rounded-xl focus-visible:ring-[#d97706]/20 bg-white shadow-sm"
                                        />
                                    </div>
                                </TabsContent>

                                <div className="space-y-2">
                                    <Label htmlFor="password" title="password" className="text-[#1a1a1a] font-medium text-sm">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 border-[#dcd9c6] rounded-xl focus-visible:ring-[#d97706]/20 bg-white pr-12 shadow-sm"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-0 h-full px-3 py-2 hover:bg-transparent text-[#999] hover:text-[#d97706]"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-[#d97706] hover:bg-[#c2410c] text-white shadow-lg py-6 rounded-xl text-md font-bold transition-all flex items-center justify-center gap-2" disabled={isLoading || loginMethod === 'mobile'}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Tabs>

                        <div className="mt-8 mb-6 text-center space-y-4">
                            <Link href="/auth/forgot-password" title="title text" className="text-sm text-[#d97706] hover:underline font-medium block">
                                Forgot your password?
                            </Link>
                            <div className="text-sm text-[#666] pt-4 border-t border-[#dcd9c6] flex items-center justify-center gap-1.5">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-[#d97706] hover:underline font-bold">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
