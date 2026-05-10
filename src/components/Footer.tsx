"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/admitra-logo2.png"
                  alt="Admitra logo"
                  width={250}
                  height={80}
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              Your college application system — where essays, deadlines, and feedback actually connect.
            </p>
            <a
              href="mailto:hello@admitra.com"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@admitra.com
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  System
                </Link>
              </li>
              <li>
                <Link href="#product-preview" className="hover:text-foreground transition-colors">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="#cta" className="hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="mailto:hello@admitra.com" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Admitra. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>

          {/* Privacy / FERPA Note */}
          <div className="mt-8 p-4 bg-secondary rounded-xl text-center">
            <p className="text-muted-foreground text-sm">
              Built student-first. Invite counselors and teachers into the same context when you are ready.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
