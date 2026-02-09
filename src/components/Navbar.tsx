"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
          : "bg-white dark:bg-background"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Sensei
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {open ? (
                <X size={24} className="text-gray-900 dark:text-white" />
              ) : (
                <Menu size={24} className="text-gray-900 dark:text-white" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/essay"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Essays
                    </Link>
                    <Link
                      href="/timeline"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Timeline
                    </Link>
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                      <DarkModeToggle />
                      <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white dark:text-gray-900" />
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="#features"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Features
                    </Link>
                    <Link
                      href="#product-preview"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Product
                    </Link>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                    >
                      Log In
                    </Link>
                    <DarkModeToggle />
                    <Link
                      href="#cta"
                      className="ml-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold"
                    >
                      Get Access
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-center mb-2">
                <DarkModeToggle />
              </div>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/essay"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Essays
                      </Link>
                      <Link
                        href="/timeline"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Timeline
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                        <button
                          onClick={() => {
                            handleSignOut();
                            setOpen(false);
                          }}
                          className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium flex items-center gap-2"
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
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Features
                      </Link>
                      <Link
                        href="#product-preview"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Product
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Log In
                      </Link>
                      <Link
                        href="#cta"
                        onClick={() => setOpen(false)}
                        className="mt-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold text-center"
                      >
                        Get Access
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
