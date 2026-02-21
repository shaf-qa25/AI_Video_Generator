"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { LayoutDashboard, Zap, Compass, CreditCard, Home } from 'lucide-react'

function Header() {
    const { user } = useUser()

    return (
        <div className='fixed top-0 left-0 right-0 z-[100] flex justify-center p-4'>
            {/* Main Nav Container */}
            <div className='w-full max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden'>

                {/* Subtle Top Glow Line */}
                <div className='absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent'></div>

                {/* Logo Section */}
                <Link href={"/"} className='flex items-center gap-2 group transition-all relative z-10'>
                    <div className='bg-primary p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(82,39,255,0.6)] transition-all duration-300'>
                        <Zap size={18} className='text-white fill-white' />
                    </div>
                    <h2 className='font-black text-xl tracking-tighter uppercase italic text-white group-hover:text-blue-500 transition-colors'>
                        Vid<span className='text-blue-500'>Course</span>
                    </h2>
                </Link>

                {/* Center Navigation - Sleek & Spaced */}
                <nav className='hidden md:flex items-center gap-8 font-black text-[10px] tracking-[0.25em] uppercase text-zinc-300'>
                    <Link href={"/"} className='flex items-center gap-2 hover:text-white transition-colors group'>
                        <Home size={14} className='group-hover:text-blue-300' />
                        Home
                    </Link>
                    <Link href={"/explore"} className='flex items-center gap-2 hover:text-white transition-colors group'>
                        <Compass size={14} className='group-hover:text-blue-300' />
                        Explore
                    </Link>
                    <Link href={"/pricing"} className='hover:text-white transition-colors'>
                        Pricing
                    </Link>
                </nav>

                {/* Auth & Dashboard */}
                <div className='flex items-center gap-2 md:gap-4 relative z-10'>
                    {user ? (
                        <div className='flex items-center gap-2 md:gap-3'>
                            <Link href={"/dashboard"}>
                                <Button
                                    variant="outline"
                                    className="flex gap-2 items-center rounded-xl border-white/10 bg-white/5 hover:border-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest h-9 px-3 md:px-4 transition-all duration-300 text-white"
                                >
                                    <LayoutDashboard size={14} />
                                    <span className="hidden xs:block">Dashboard</span>
                                    <span className="xs:hidden">Dash</span>
                                </Button>
                            </Link>

                            <div className='h-9 w-9 rounded-full border border-primary/30 p-0.5 hover:border-primary transition-all shadow-[0_0_10px_rgba(82,39,255,0.2)]'>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </div>
                    ) : (
                        <SignInButton mode='modal'>
                            <button className='relative inline-flex h-9 md:h-10 overflow-hidden rounded-xl p-[1px] focus:outline-none'>
                                <span className='absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#5227FF_50%,#E2E8F0_100%)]' />
                                <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-black px-4 md:px-6 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-3xl hover:bg-zinc-900 transition-all'>
                                    Join
                                </span>
                            </button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header