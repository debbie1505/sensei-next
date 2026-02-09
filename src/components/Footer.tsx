"use client";
import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-900" />
              </div>
              <Link href="/" className="text-2xl font-bold">
                Sensei
              </Link>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              One system for counselors, teachers, and students to manage the college application process together.
            </p>
            <a
              href="mailto:hello@usesensei.app"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@usesensei.app
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#product-preview" className="hover:text-white transition-colors">
                  Product
                </Link>
              </li>
              <li>
                <Link href="#cta" className="hover:text-white transition-colors">
                  Get Access
                </Link>
              </li>
              <li>
                <a href="mailto:hello@usesensei.app" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Sensei. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>

          {/* Privacy / FERPA Note */}
          <div className="mt-8 p-4 bg-gray-800 rounded-xl text-center">
            <p className="text-gray-400 text-sm">
              Built for students, schools, and educators. FERPA-aware design. 13+ only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
