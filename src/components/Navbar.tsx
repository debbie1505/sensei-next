"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle"
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, User as UserIcon, LogOut } from "lucide-react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-card/90 backdrop-blur-md shadow-lg border-b border-border/50' 
        : 'bg-card/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sensei
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-300 hover:scale-105"
            >
              {open ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            <DarkModeToggle />
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/essay" 
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      Essay Review
                    </Link>
                    <Link 
                      href="/timeline" 
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      Timeline
                    </Link>
                    <Link 
                      href="/scholarships" 
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      Scholarships
                    </Link>
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 rounded-xl text-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 font-medium flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      href="#features" 
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      Features
                    </Link>
                    <Link
                      href="#testimonials"
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      FAQ
                    </Link>
                    <Link 
                      href="/login" 
                      className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                    >
                      Log In
                    </Link>
                    <Link
                      href="#waitlist"
                      className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                    >
                      Join Waitlist
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {open && (
          <div className="md:hidden mt-6 bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center mb-4">
                <DarkModeToggle />
              </div>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium flex items-center gap-3"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">D</span>
                        </div>
                        Dashboard
                      </Link>
                      <Link 
                        href="/essay" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium flex items-center gap-3"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">E</span>
                        </div>
                        Essay Review
                      </Link>
                      <Link 
                        href="/timeline" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium flex items-center gap-3"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">T</span>
                        </div>
                        Timeline
                      </Link>
                      <Link 
                        href="/scholarships" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium flex items-center gap-3"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">S</span>
                        </div>
                        Scholarships
                      </Link>
                      <div className="border-t border-border pt-4 mt-4">
                        <button
                          onClick={() => {
                            handleSignOut();
                            setOpen(false);
                          }}
                          className="w-full px-4 py-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 font-medium flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="#features" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                      >
                        Features
                      </Link>
                      <Link 
                        href="#testimonials" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                      >
                        FAQ
                      </Link>
                      <Link 
                        href="/login" 
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-accent transition-all duration-300 font-medium"
                      >
                        Log In
                      </Link>
                      <Link
                        href="#waitlist"
                        onClick={() => setOpen(false)}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-center block"
                      >
                        Join Waitlist
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
