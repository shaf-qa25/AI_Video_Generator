"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Play, BookOpen, Trash2, Loader2, Home } from 'lucide-react'
import Header from '@/_components/Header'
import Silk from "@/components/Silk.jsx"

function Dashboard() {
    const { user } = useUser();
    const [courseList, setCourseList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const hasFetched = useRef(false);
    const router = useRouter();

    const getUserCourses = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch('/api/user-courses');
            const data = await response.json();
            setCourseList(data);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Delete Logic 
    const deleteCourse = async (courseId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("This course will be deleted permanently. Do you really want to delete it?")) return;

        setDeletingId(courseId);
        try {
            const response = await fetch(`/api/user-courses?courseId=${courseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCourseList((prev) => prev.filter(c => (c.courseId || c.id) !== courseId));
            } else {
                alert("Deletion failed.Some error occured.Please try again.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    }

    useEffect(() => {
        if (user && !hasFetched.current) {
            getUserCourses();
            hasFetched.current = true;
        }
    }, [user, getUserCourses]);

    return (
        <div className='relative min-h-screen w-full bg-[#030303] overflow-hidden'>
            <Header />
            <div className='fixed inset-0 z-0 opacity-30 pointer-events-none'>
                <Silk speed={0.8} scale={1.2} color="#4F46E5" />
            </div>

            <div className='relative z-10 p-10 md:px-20 lg:px-40 mt-20'>
                <header className='flex justify-between items-center mb-16'>

                    <div className='flex gap-4'>
                        <button
                            onClick={() => router.push('/')}
                            className='bg-primary text-white px-8 py-3 rounded-xl hover:scale-105 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20'
                        >
                            + Create New
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {[1, 2, 3].map((i) => <div key={i} className='h-64 bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5'></div>)}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        <AnimatePresence mode='popLayout'>
                            {courseList.map((course) => (
                                <motion.div
                                    key={course.courseId || course.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className='relative group p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] transition-all h-72 flex flex-col justify-between'
                                    onClick={() => router.push(`/generate?prompt=${encodeURIComponent(course.prompt)}&type=${course.type}`)}
                                >
                                    <div className='flex justify-between items-start'>
                                        <div className='px-3 py-1 rounded-full border-red-500 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest'>
                                            {course.type}
                                        </div>
                                        <button
                                            onClick={(e) => deleteCourse(course.courseId || course.id, e)}
                                            className='text-zinc-600 hover:text-red-500 p-2'
                                        >
                                            {deletingId === (course.courseId || course.id) ? <Loader2 className='animate-spin' size={18} /> : <Trash2 size={18} />}
                                        </button>
                                    </div>
                                    <h3 className='text-xl font-bold text-white line-clamp-2'>{course.prompt}</h3>
                                    <div className='flex justify-between items-center pt-4 border-t border-white/5'>
                                        <span className='flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500'><Play size={12} /> Launch</span>
                                        <span className='text-[10px] font-black text-zinc-600'>{course.content?.length || 0} MODULES</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Dashboard