import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-bgMain/95 backdrop-blur-sm border-b border-white/5 px-6 py-4">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Left Side: Logo & Menu */}
        <div className="flex items-center gap-12">
          <a
            href="/"
            className="text-2xl font-bold text-primary tracking-wider hover:opacity-90 transition-opacity"
          >
            STREAMFLIX
          </a>

          <div className="hidden md:flex gap-6 text-sm font-medium text-textSecondary">
            <a
              href="#"
              className="text-textPrimary hover:text-primary transition-colors"
            >
              Home
            </a>
            <a href="#" className="hover:text-textPrimary transition-colors">
              Community
            </a>
          </div>
        </div>

        {/* Right Side: Search & Login */}
        <div className="flex items-center gap-6">
          <button className="text-textSecondary hover:text-textPrimary transition-colors">
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>

          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors group"
          >
            {/* Login Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 group-hover:text-primary transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            

            <NavLink to={'/login'}>Login</NavLink>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
