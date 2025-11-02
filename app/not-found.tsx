"use client"

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link"
import "./globals.css"; 
export default function NotFound() {
    return (
         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative z-10 text-center max-w-2xl">
                {/* Animated 404 */}
                <div className="mb-12 relative">
                    <h1 className="text-[10rem] md:text-[14rem] font-extralight text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-600 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-2 border-slate-300 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 mb-12">
                    <h2 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight">
                        Lost in Space
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg font-light max-w-md mx-auto leading-relaxed">
                        The page you're looking for seems to have drifted away into the void.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                        href="/"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <Home size={18} />
                        <span className="font-medium">Return Home</span>
                    </a>
                    <button
                        onClick={() => window.history.back()}
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 rounded-full hover:bg-slate-50 transition-all duration-300 border border-slate-200 hover:border-slate-300 hover:scale-105"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-medium">Go Back</span>
                    </button>
                </div>

                {/* Small decorative element */}
                <div className="mt-16 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>
        </div>
    );
    
}
