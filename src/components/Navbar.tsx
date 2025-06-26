"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle"
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Sensei
        </Link>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          <DarkModeToggle />
          <Link href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-700 hover:text-blue-600"
          >
            Testimonials
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            Log In
          </Link>
          <Link
            href="#waitlist"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Join Waitlist
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 flex flex-col items-start space-y-2">
          <DarkModeToggle />
          <Link href="#features" onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link href="#testimonials" onClick={() => setOpen(false)}>
            Testimonials
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>
            Log In
          </Link>
          <Link
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="text-blue-600 font-semibold"
          >
            Join Waitlist
          </Link>
        </div>
      )}
    </nav>
  );
}
