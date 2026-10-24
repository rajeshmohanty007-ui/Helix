"use client";

import React from "react";
import Link from "next/link";

const Navbar = ({ onReg, onLog }) => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0b1020]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href="/">
            <h1 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-3xl font-black text-transparent font-Saira cursor-pointer">
              Helix
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/" className="transition hover:text-white">
              Pricing
            </Link>
            <Link href="/" className="transition hover:text-white">
              FAQs
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {onLog ? (
            <button
              type="button"
              className="rounded-xl border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white/10 cursor-pointer"
              onClick={onLog}
            >
              Login
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-xl border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white/10 cursor-pointer"
            >
              Login
            </Link>
          )}

          {onReg ? (
            <button
              type="button"
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 cursor-pointer"
              onClick={onReg}
            >
              Register
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 cursor-pointer"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
