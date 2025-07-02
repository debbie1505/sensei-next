"use client";

export default function Footer() {
  return (
    <footer className="bg-white py-6 px-6 mt-16 text-center text-gray-500 text-sm border-t">
      &copy; {new Date().getFullYear()} Sensei. All rights reserved.
    </footer>
  );
}
