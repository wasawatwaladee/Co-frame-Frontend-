import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useUserStore from "../stores/Store";

const Navbar = () => {
  const isDarkMode = useUserStore(state => state.isDarkMode);
  const toggleTheme = useUserStore(state => state.toggleTheme);
  const user = useUserStore(state => state.user);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleSearchBlur = () => {
    if (searchValue === "") {
      setShowSearch(false);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-md px-6 py-3 transition-all duration-300 ${
        isDarkMode
          ? "bg-black/95 border-b border-white/10"
          : "bg-white/95 border-b border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Left Side: Logo & Menu */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <span
              className={`text-2xl font-bold tracking-tight transition-colors ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Cine<span className="text-[#d50000] font-bold">Verse</span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-5">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#d50000] font-bold"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to={"/community"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#d50000] font-bold"
                    : isDarkMode
                    ? "text-gray-100 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`
              }
            >
              Community
            </NavLink>
          </div>
        </div>

        {/* Right Side: Theme Toggle, Search & Login */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isDarkMode
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-700 hover:text-gray-900"
            } hover:scale-110 active:scale-95`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Search */}
          <div className="relative flex items-center">
            {!showSearch && searchValue ? (
              <button
                onClick={handleSearchClick}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {searchValue}
              </button>
            ) : showSearch ? (
              <input
                type="text"
                placeholder="Search movies..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onBlur={handleSearchBlur}
                autoFocus
                className={`w-0 px-4 py-2 text-xs rounded-lg transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-white origin-right animate-[stretch_0.5s_ease-out_forwards] ${
                  isDarkMode
                    ? "bg-gray-500 text-white placeholder:text-gray-400 border border-gray-700"
                    : "bg-gray-200 text-black placeholder:text-gray-500 border border-gray-300"
                }`}
                style={{ width: showSearch ? "16rem" : "0" }}
              />
            ) : (
              <button
                onClick={handleSearchClick}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDarkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                aria-label="Search"
              >
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
            )}
          </div>

          {/* User Profile */}
          <NavLink
            to="/profile"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDarkMode
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-700 hover:text-gray-900"
            }`}
            aria-label="User profile"
          >
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </NavLink>

          {/* Login / Username Kay 30/11 */}
          {user ? (
            <NavLink
              to={"/profile"}
              className={`px-4 py-2 text-xs font-semibold rounded transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {typeof user === 'string' ? user : user.name || user.email || 'Profile'}
            </NavLink>
          ) : (
            <NavLink
              to={"/login"}
              className={`px-4 py-2 text-xs font-semibold rounded transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
