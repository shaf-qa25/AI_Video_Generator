"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Suggestion, SUGGESTIONS } from '@/data/constant'
import Antigravity from '@/components/Antigravity'

function Hero() {
    const [userInput, setUserInput] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("quick");
    const router = useRouter();

    const handleGenerate = () => {
        if (!userInput.trim()) {
            alert("Please type something");
            return;
        }
        router.push(`/generate?prompt=${encodeURIComponent(userInput)}&type=${selectedType}`);
    }

    return (
        <div className='relative min-h-screen flex flex-col items-center justify-center pt-10 pb-10 px-5 md:px-20 gap-10 overflow-hidden bg-[#030303]'>

            {/* --- ANTIGRAVITY BACKGROUND LAYER --- */}
            <div className='absolute inset-0 z-0 pointer-events-none opacity-50'>
                <Antigravity
                    count={250}
                    magnetRadius={6}
                    ringRadius={7}
                    waveSpeed={0.4}
                    waveAmplitude={1}
                    particleSize={1.5}
                    lerpSpeed={0.05}
                    color="#5227FF"
                    autoAnimate
                    particleVariance={1}
                    rotationSpeed={0}
                    depthFactor={1}
                    pulseSpeed={3}
                    particleShape="capsule"
                    fieldStrength={10}
                />
            </div>

            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[rgba(82,39,255,0.08)] blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[rgba(100,200,250,0.05)] blur-[120px]"></div>
            </div>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-center space-y-6 z-10'
            >
                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-white/[0.08] text-primary text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md'>
                    <Sparkles size={14} className='animate-pulse' /> AI Powered Learning
                </div>
                <h1 className='text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-white'>
                    LEARN <span className='text-blue-500 drop-shadow-[0_0_25px_rgba(82,39,255,0.4)]'>ANYTHING.</span>
                </h1>
                <p className='text-zinc-500 text-lg md:text-xl max-w-xl mx-auto font-medium'>
                    Convert complex topics into cinematic visual stories in seconds.
                </p>
            </motion.div>

            {/* Main Input Box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-3xl relative group z-10"
            >
                {/* Outer Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative p-2 bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[1.8rem] border border-white/[0.08] shadow-2xl">
                    <textarea
                        className="flex min-h-[160px] w-full resize-none bg-transparent px-6 py-6 text-xl font-medium outline-none border-none focus-visible:ring-0 placeholder:text-zinc-700 text-zinc-100"
                        placeholder="Explain Quantum Computing like I'm five..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />

                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                            <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                                <SelectTrigger className="w-[180px] bg-black/40 border-white/5 shadow-sm h-11 font-black uppercase text-[10px] tracking-widest text-zinc-300">
                                    <SelectValue placeholder="Mode" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-white/10 bg-[#0f0f0f] text-white">
                                    <SelectGroup>
                                        <SelectItem value="long" className="text-xs font-bold uppercase tracking-widest cursor-pointer">📚 Full-Course</SelectItem>
                                        <SelectItem value="quick" className="text-xs font-bold uppercase tracking-widest  cursor-pointer">⚡ Quick-Explain</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            className="bg-primary text-white h-12 w-12 rounded-full shadow-[0_0_20px_rgba(82,39,255,0.3)] hover:shadow-primary/60 hover:scale-110 active:scale-95 transition-all flex items-center justify-center overflow-hidden"
                        >
                            <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Suggestions Chips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='flex flex-wrap items-center justify-center gap-3 max-w-2xl z-10'
            >
                {SUGGESTIONS.map((item: Suggestion) => (
                    <button
                        key={item.id}
                        onClick={() => setUserInput(item.prompt)}
                        className="text-[10px] font-black uppercase tracking-[0.15em] bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/5 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 text-zinc-500"
                    >
                        <span className='opacity-60'>{item.icon}</span>
                        {item.title}
                    </button>
                ))}
            </motion.div>
        </div>
    )
}

export default Hero