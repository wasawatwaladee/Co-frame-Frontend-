import React, { useState } from 'react';
import { Link } from 'react-router';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden py-8 animate-fade-in ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDarkMode 
            ? 'bg-surface-dark text-white shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]' 
            : 'bg-white text-gray-800 shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(0,0,0,0.05)]'
        } hover:scale-105 active:scale-95`}
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-linear-to-br from-black via-input-dark to-black' : 'bg-linear-to-br from-white via-gray-100 to-white'}`} />
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
      </div>

      {/* Register Form */}
      <div className="relative w-full max-w-md mx-4">
        <div 
          className={`p-8 rounded-xl shadow-2xl ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          style={{ 
            boxShadow: isDarkMode 
              ? '0 20px 40px rgba(0, 0, 0, 0.8), 0 10px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
              : '0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(0, 0, 0, 0.02)'
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-input-3d">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                <g clipPath="url(#clip0_6_330)">
                  <path 
                    clipRule="evenodd" 
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" 
                    fill="currentColor" 
                    fillRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect fill="white" height="48" width="48" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h1 className={`text-2xl tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              CINE<span className="text-primary font-bold">VERSE</span>
            </h1>
          </div>

          <div>
            <h2 className={`mb-2 text-center text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Create Account</h2>
            <p className={`text-center mb-6 text-sm ${isDarkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              Join the ultimate streaming community
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDarkMode ? 'text-text-primary' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  className={`w-full py-2.5 px-4 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-input-3d ${isDarkMode ? 'bg-input-dark text-white placeholder:text-text-secondary' : 'bg-gray-100 text-black placeholder:text-gray-500'}`}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDarkMode ? 'text-text-primary' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  className={`w-full py-2.5 px-4 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-input-3d ${isDarkMode ? 'bg-input-dark text-white placeholder:text-text-secondary' : 'bg-gray-100 text-black placeholder:text-gray-500'}`}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDarkMode ? 'text-text-primary' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Create a password"
                    className={`w-full py-2.5 px-4 pr-12 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-input-3d ${isDarkMode ? 'bg-input-dark text-white placeholder:text-text-secondary' : 'bg-gray-100 text-black placeholder:text-gray-500'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-text-secondary hover:text-white' : 'text-gray-500 hover:text-black'}`}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className={`block text-sm mb-2 font-medium ${isDarkMode ? 'text-text-primary' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                    className={`w-full py-2.5 px-4 pr-12 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-input-3d ${isDarkMode ? 'bg-input-dark text-white placeholder:text-text-secondary' : 'bg-gray-100 text-black placeholder:text-gray-500'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-text-secondary hover:text-white' : 'text-gray-500 hover:text-black'}`}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-primary"
                  required
                />
                <label className={`text-xs ${isDarkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                  I agree to the{" "}
                  <button type="button" className="text-primary hover:text-accent-secondary">
                    Terms of Service
                  </button>
                  {" "}and{" "}
                  <button type="button" className="text-primary hover:text-accent-secondary">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 text-sm font-bold rounded-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg"
              >
                Create Account
              </button>

              {/* Login Link */}
              <p className={`text-center text-sm pt-2 ${isDarkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-primary hover:text-accent-secondary transition-colors font-medium"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
