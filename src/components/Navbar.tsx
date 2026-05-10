"use client";

import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "./DarkModeToggle";
import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { clearMockSession, getMockSession, isMockAuthEnabled } from "@/utils/mock/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isMockAuthEnabled()) {
      const mockSession = getMockSession();
      if (mockSession) {
        setUser({
          id: mockSession.userId,
          email: mockSession.email,
        } as User);
      } else {
        setUser(null);
      }
      setLoading(false);

      const onStorage = () => {
        const nextSession = getMockSession();
        if (nextSession) {
          setUser({
            id: nextSession.userId,
            email: nextSession.email,
          } as User);
        } else {
          setUser(null);
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }

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
    if (isMockAuthEnabled()) {
      clearMockSession();
      setUser(null);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-background border-b border-border/70"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/admitra-logo2.png"
              alt="Admitra logo"
              width={210}
              height={68}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {open ? (
                <X size={24} className="text-foreground" />
              ) : (
                <Menu size={24} className="text-foreground" />
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
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/essay"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Essays
                    </Link>
                    <Link
                      href="/timeline"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Timeline
                    </Link>
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                      <DarkModeToggle />
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="px-3 py-2 text-muted-foreground hover:text-destructive transition-colors font-medium flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="#features"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      System
                    </Link>
                    <Link
                      href="#product-preview"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Timeline + Essays
                    </Link>
                    <Link
                      href="/pricing"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Log In
                    </Link>
                    <DarkModeToggle />
                    <Link
                      href="#cta"
                      className="ml-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90 transition-colors font-semibold"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 bg-card rounded-xl border border-border p-4">
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
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/essay"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        Essays
                      </Link>
                      <Link
                        href="/timeline"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        Timeline
                      </Link>
                      <div className="border-t border-border pt-2 mt-2">
                        <button
                          onClick={() => {
                            handleSignOut();
                            setOpen(false);
                          }}
                          className="w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium flex items-center gap-2"
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
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        System
                      </Link>
                      <Link
                        href="#product-preview"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        Timeline + Essays
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors font-medium"
                      >
                        Log In
                      </Link>
                      <Link
                        href="#cta"
                        onClick={() => setOpen(false)}
                        className="mt-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-colors font-semibold text-center"
                      >
                        Get Started
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
