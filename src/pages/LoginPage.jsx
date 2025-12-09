import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { loginSchema } from "../validations/schema";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import useUserStore from "../stores/Store";

const API_URL = "http://localhost:5500/api/auth/google/login";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const login = useUserStore((state) => state.login);
  const googleLogin = useUserStore((state) => state.googleLogin);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [googleResponse, setGoogleResponse] = useState(null);

  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const navigate = useNavigate();
  const { isSubmitting, errors } = formState;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const onSubmit = async (data) => {
    try {
      console.log("test onSubmit");
      await login(data);
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      const errMsg = error.response?.data.message || error.message;
      toast.error(errMsg);
    }
  };

  const myGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      console.log("Google Login Success:", codeResponse);
    },
    onError: (error) => console.log("Google Login Failed:", error),
    scope: "openid profile email",
  });

  useEffect(() => {
    const handleBackendLogin = async () => {
      // ตรวจสอบว่ามี Google Response และ access_token
      if (!googleResponse || !googleResponse.credential) return;

      console.log("Sending ID Token to backend...");

      try {
        const idToken = googleResponse.credential;

        const res = await googleLogin(idToken);

        const { user: userProfile } = res.data;

        toast.success(`Welcome, ${userProfile.name}!`);

        setProfile(userProfile);
        navigate("/");
      } catch (error) {
        const errMsg = error.response?.data.message || error.message;
        console.error("Backend Error:", error);
        toast.error(`Google Login Failed: ${errMsg}`);
        setGoogleResponse(null);
      }
    };

    handleBackendLogin();
  }, [googleResponse, googleLogin, navigate]);

  const logout = () => {
    setGoogleResponse(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden py-8 animate-fade-in ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDarkMode
            ? "bg-surface-dark text-white shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
            : "bg-white text-gray-800 shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(0,0,0,0.05)]"
        } hover:scale-105 active:scale-95`}
      >
        {isDarkMode ? (
          <svg
            className="w-6 h-6"
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
            className="w-6 h-6"
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

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-linear-to-br from-black via-input-dark to-black"
              : "bg-linear-to-br from-gray-50 via-white to-gray-100"
          }`}
        />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
      </div>

      {/* Login Form */}
      <div className="relative w-full max-w-md mx-4">
        <div
          className={`${
            isDarkMode ? "bg-black" : "bg-white"
          } p-8 rounded-xl shadow-2xl`}
          style={{
            boxShadow: isDarkMode
              ? "0 20px 40px rgba(255, 255, 255, 0.1), 0 10px 20px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-input-3d animate-bounce">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
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
            <h1
              className={`text-2xl tracking-tight ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              CINE<span className="text-primary font-bold">VERSE</span>
            </h1>
          </div>

          <div>
            <h2
              className={`${
                isDarkMode ? "text-white" : "text-black"
              } mb-2 text-center text-2xl font-bold`}
            >
              Welcome Back
            </h2>
            <p
              className={`${
                isDarkMode ? "text-text-secondary" : "text-gray-600"
              } text-center mb-6 text-sm`}
            >
              Sign in to continue watching
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <fieldset disabled={isSubmitting}>
                {/* Email Input */}
                <div>
                  <label
                    className={`block text-sm ${
                      isDarkMode ? "text-text-primary" : "text-gray-700"
                    } mb-2 font-medium`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full ${
                      isDarkMode
                        ? "bg-zinc-900 text-white placeholder:text-text-secondary"
                        : "bg-gray-100 text-black placeholder:text-gray-500"
                    } py-2.5 px-4 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-input-3d`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p
                      className={`text-sm mt-1 ${
                        isDarkMode ? "text-primary" : "text-red-600"
                      }`}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="mt-4">
                  <label
                    className={`block text-sm ${
                      isDarkMode ? "text-text-primary" : "text-gray-700"
                    } mb-2 font-medium`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full ${
                        isDarkMode
                          ? "bg-zinc-900 text-white placeholder:text-text-secondary"
                          : "bg-gray-100 text-black placeholder:text-gray-500"
                      } py-2.5 px-4 pr-12 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-input-3d`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode
                          ? "text-text-secondary hover:text-white"
                          : "text-gray-500 hover:text-black"
                      } transition-colors`}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className={`text-sm mt-1 ${
                        isDarkMode ? "text-red-600" : "text-red-600"
                      }`}
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-primary" />
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-text-secondary" : "text-gray-600"
                      }`}
                    >
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className={`text-xs ${
                      isDarkMode ? "text-text-secondary" : "text-gray-600"
                    } hover:text-primary transition-colors`}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full bg-primary py-3 text-sm font-bold rounded-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Google Login Button */}
                <div className="mt-4">
                  {profile ? (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-surface-dark" : "bg-gray-100"
                      }`}
                    >
                      <h3
                        className={`font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        User Logged in
                      </h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-text-secondary" : "text-gray-600"
                        }`}
                      >
                        Name: {profile.name}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-text-secondary" : "text-gray-600"
                        }`}
                      >
                        Email: {profile.email}
                      </p>
                      <button
                        onClick={logout}
                        className="mt-3 w-full bg-red-600 text-white py-2 text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        setGoogleResponse(credentialResponse);
                        console.log(
                          "Google Component Success:",
                          credentialResponse
                        );
                      }}
                      onError={() => console.log("Google Component Failed.")}
                      // การตั้งค่าเหล่านี้ใช้ในการปรับรูปลักษณ์ปุ่ม Google
                      text="continue_with"
                      size="large"
                      width="400px" // กำหนดความกว้าง (เนื่องจากปุ่มเดิมใช้ w-full)
                    />
                  )}
                </div>

                {/* Register Link */}
                <p
                  className={`text-center text-sm ${
                    isDarkMode ? "text-text-secondary" : "text-gray-600"
                  } pt-4`}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary hover:text-accent-secondary transition-colors font-medium"
                  >
                    Create Account
                  </Link>
                </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
