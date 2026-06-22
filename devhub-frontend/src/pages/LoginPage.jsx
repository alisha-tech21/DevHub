import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const LoginPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(180); // 10 minutes in seconds
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Timer logic
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsLogin(false);
    } else if (location.pathname === "/login") {
      setIsLogin(true);
    }
    // Agar location.state mein mode aayega, usay bhi handle karein
    if (location.state?.mode === "signup") setIsLogin(false);
  }, [location.pathname, location.state]);
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrors({});
    const redirectPath = location.state?.from || "/";
    if (isOtpSent) {
      if (timer === 0) return toast.error("OTP expired!");
      try {
        const response = await fetch("${API_URL}/api/users/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Verified successfully! Please sign in.");

          setIsOtpSent(false);
          setIsLogin(true);
        } else {
          setErrors({ email: data.message || "Invalid OTP" });
        }
      } catch (err) {
        toast.error("Verification failed!");
      }
      return;
    }

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
    const requestBody = isLogin
      ? { email, password }
      : { email, password, name, githubUsername: "not-set" };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("token", data.token);

          setUser(data);

          toast.success("Logged in successfully!");

          navigate(redirectPath, {
            replace: true,
          });
        } else {
          toast.success("OTP sent to your email!");
          setIsOtpSent(true);
          setTimer(180); // Reset timer
        }
      } else {
        setErrors({ email: data.message || "Authentication failed" });
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Toaster position="bottom-center" />
      <div className="w-full max-w-[400px] mx-4 bg-[#0A0A0A] border border-neutral-800 p-5 sm:p-8 rounded-2xl shadow-2xl">
        {/* Web Name Added */}
        <div className="flex justify-center mb-6">
          <h1 className="text-indigo-500 font-bold text-2xl tracking-[0.2em] uppercase cursor-pointer">
            DevHub
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold">
          {isOtpSent
            ? "Verify your account"
            : isLogin
              ? "Welcome back"
              : "Create your account"}
        </h2>

        <p className="text-neutral-500 mb-8 text-xs sm:text-sm">
          {isOtpSent
            ? `Enter the 6-digit code sent to your email. Expires in: ${formatTime(timer)}`
            : isLogin
              ? "Enter your details to access your dashboard"
              : "Join our developer community"}
        </p>

        <form onSubmit={handleAuth} className="space-y-4" noValidate>
          {isOtpSent ? (
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                OTP Code
              </label>
              <input
                type="text"
                className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-center text-2xl tracking-[10px] text-white focus:outline-none focus:border-indigo-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
              />
            </div>
          ) : (
            <>
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete={isLogin ? "email" : "off"}
                  className={`w-full bg-[#121212] border rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 ${errors.email ? "border-red-500" : "border-neutral-800"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full bg-[#121212] border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full font-bold py-3 rounded-lg transition-all mt-2 cursor-pointer ${isOtpSent && timer === 0 ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
          >
            {isOtpSent
              ? timer === 0
                ? "OTP Expired"
                : "Verify Code"
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {isOtpSent ? (
            <span
              className="text-indigo-400 font-semibold cursor-pointer hover:underline"
              onClick={() => setIsOtpSent(false)}
            >
              Back to Sign up
            </span>
          ) : (
            <>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                className="text-indigo-400 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setName("");
                  setOtp("");
                  setErrors({});

                  if (isLogin) {
                    navigate("/signup");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
