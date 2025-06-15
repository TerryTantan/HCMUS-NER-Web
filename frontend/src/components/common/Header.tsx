import React from "react";

export default function Header() {
  return (
    <header className="bg-gradient-to-b from-gray-800 to-gray-700 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-8" />
          <span className="font-semibold text-lg">PII Masking</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex justify-center space-x-10 text-sm font-medium">
          <a href="#HowItWorks" className="hover:underline">
            How it works
          </a>
          <a href="#Convert" className="hover:underline">
            Convert
          </a>
          <a href="#Contact" className="hover:underline">
            Contact
          </a>
        </nav>

        {/* Auth */}
        <div className="flex items-center space-x-4 text-sm font-medium">
          <a href="#SignUp" className="hover:underline">
            Sign Up
          </a>
          <a href="#Login" className="hover:underline">
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
