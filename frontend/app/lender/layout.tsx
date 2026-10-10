"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { LayoutDashboard, Wallet, PieChart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LenderLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth()
    const pathname = usePathname()

    if (!user || user.role !== 'lender') {
        return <div className="p-10 text-center">Unauthorized Access</div>
    }

    const navigation = [
        { name: "Lending Portfolio", href: "/lender", icon: LayoutDashboard },
        { name: "Personal Finance", href: "/lender/finance", icon: Wallet },
        { name: "Budgets", href: "/lender/budgets", icon: PieChart },
    ]

    return (
        <div className="min-h-screen bg-orange-50/30 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-orange-100 shadow-sm hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-orange-50">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-white font-bold sanskrit-text text-xl">धन</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-orange-950">DhanPath</h2>
                        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest leading-none">Finance Tracker</p>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-orange-950 hover:bg-orange-50 hover:text-orange-600'}`}>
                                    <Icon className="w-5 h-5" />
                                    <span className="font-bold text-sm">{item.name}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-orange-50">
                    <div className="mb-4 px-2">
                        <p className="text-xs font-black text-orange-900">{user.name}</p>
                        <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold">{user.email}</p>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={logout}>
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-bold">Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
