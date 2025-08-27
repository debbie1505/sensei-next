"use client";
import Link from "next/link";
import { Heart, Mail, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Enhanced Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <Link href="/" className="text-3xl font-bold text-blue-400">
                Sensei
              </Link>
            </div>
            <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
              An AI mentor for college applications. Turn chaos into a step-by-step plan.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:hello@usesensei.app" 
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 bg-gray-800/50 p-3 rounded-xl hover:bg-gray-700/50"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enhanced Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Links</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="#features" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="#waitlist" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Join Waitlist
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:hello@usesensei.app" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom */}
        <div className="border-t border-gray-800 mt-16 pt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Sensei. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:underline"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:underline"
            >
              Terms
            </a>
            <span className="text-gray-400 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> for students
            </span>
          </div>
        </div>

        {/* Enhanced Compliance */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm border border-gray-700/50">
            <p className="text-gray-300 text-sm font-medium">
              13+ only. Sensei is guidance, not legal/financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
