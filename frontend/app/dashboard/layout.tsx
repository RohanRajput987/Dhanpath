"use client"

import React from "react"
import Sidebar from "@/components/kokonutui/sidebar"
import TopNav from "@/components/kokonutui/top-nav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 flex-shrink-0">
                    <TopNav />
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
