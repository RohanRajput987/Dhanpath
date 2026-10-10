"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowRight, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Verification Successful!",
        description: "Your account has been verified successfully.",
      })
      router.push("/dashboard")
    }, 2000)
  }

  const handleResendOtp = () => {
    setTimeLeft(120)
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your registered number.",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground sanskrit-text">धन</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Verify Account</h1>
          <p className="text-xl sanskrit-text text-muted-foreground mb-1">सत्यापन</p>
          <p className="text-sm text-muted-foreground">Enter the OTP sent to your mobile</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>We've sent a 6-digit code to +91 98765 43210</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-bold"
                      required
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">Resend OTP in {formatTime(timeLeft)}</p>
              ) : (
                <Button variant="ghost" onClick={handleResendOtp} className="text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend OTP
                </Button>
              )}

              <div className="text-sm text-muted-foreground">
                Wrong number?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Change number
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
