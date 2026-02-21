"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function GenerateContent() {
    const searchParams = useSearchParams();
    const prompt = searchParams.get('prompt');
    const type = searchParams.get('type') || 'quick';

    const [slides, setSlides] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const hasGenerated = useRef(false);

    useEffect(() => {
        const fetchContent = async () => {
            if (!prompt || hasGenerated.current) return;
            hasGenerated.current = true;
            setLoading(true);

            try {
                const response = await fetch('/api/user-courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, type }),
                });
                const data = await response.json();

                const content = data.content || data.slides || data;
                if (Array.isArray(content)) {
                    setSlides(content);
                } else if (data.content && Array.isArray(data.content)) {
                    setSlides(data.content);
                }

                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setLoading(false);
            }
        };

        fetchContent();
    }, [prompt, type]);

    useEffect(() => {
        if (slides.length > 0) {
            const duration = 8000;
            const interval = 100;

            setProgress(0);
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setCurrentSlide((c) => (c + 1) % slides.length);
                        return 0;
                    }
                    return prev + (interval / duration) * 100;
                });
            }, interval);

            return () => clearInterval(timer);
        }
    }, [currentSlide, slides.length]);

    const renderContent = (content: any) => {
        if (!content) return "";
        if (typeof content === 'string') return content;
        if (typeof content === 'object') {
            return content.text || content.description || JSON.stringify(content);
        }
        return "No content available";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-sm font-black tracking-[0.4em] text-blue-500 uppercase"
                >
                    Generating Content...
                </motion.div>
            </div>
        );
    }

    if (slides.length === 0) return (
        <div className="h-screen bg-black flex items-center justify-center text-zinc-500">
            No content generated. Try again!
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden">
            <audio src="/music.mp3" autoPlay loop />

            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-black to-purple-900/10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
            </div>

            <div className="fixed top-0 left-0 w-full h-1.5 flex gap-1 px-2 py-4 z-50">
                {slides.map((_, index) => (
                    <div key={index} className="h-full flex-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{
                                width: index === currentSlide ? `${progress}%` : index < currentSlide ? "100%" : "0%"
                            }}
                            transition={{ ease: "linear", duration: 0.1 }}
                        />
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="z-10 max-w-5xl w-full text-center flex flex-col items-center justify-center py-20"
                >
                    <span className="px-4 py-1 rounded-full border border-blue-500/30 text-blue-400 text-[10px] font-black tracking-[0.3em] mb-6 uppercase backdrop-blur-md">
                        {type === 'long' ? 'Comprehensive Module' : 'Quick Insight'}
                    </span>

                    <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-tight text-white italic">
                        {slides[currentSlide]?.title}
                    </h2>

                    <div className="text-lg md:text-3xl text-zinc-400 font-medium max-w-4xl leading-relaxed">
                        <p>{renderContent(slides[currentSlide]?.content)}</p>

                        {slides[currentSlide]?.content?.bulletPoints && (
                            <ul className="mt-8 space-y-4 text-left inline-block">
                                {slides[currentSlide].content.bulletPoints.map((point: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-zinc-300 text-xl">
                                        <span className="text-blue-500">•</span> {point}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="fixed bottom-10 left-0 w-full px-10 flex justify-between items-center z-50">
                <button
                    onClick={() => { setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); setProgress(0); }}
                    className="p-4 hover:text-blue-400 transition-all text-zinc-600 font-black text-[10px] tracking-widest uppercase pointer-events-auto"
                >
                    PREV
                </button>

                <div className="text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase">
                    Slide {currentSlide + 1} / {slides.length}
                </div>

                <button
                    onClick={() => { setCurrentSlide((prev) => (prev + 1) % slides.length); setProgress(0); }}
                    className="p-4 hover:text-blue-400 transition-all text-zinc-600 font-black text-[10px] tracking-widest uppercase pointer-events-auto"
                >
                    NEXT
                </button>
            </div>
        </div>
    )
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<div className="h-screen bg-black" />}>
            <GenerateContent />
        </Suspense>
    );
}