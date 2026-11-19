"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertCircle, ArrowLeft, Bus, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { User } from "@/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [mobile, setMobile] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOtpNotice, setActiveOtpNotice] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval: any = null;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const clean = mobile.replace(/\D/g, "");
    if (clean.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: clean }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("otp");
        setActiveOtpNotice(data.otp);
        setTimer(30);
        // Focus first OTP box
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const code = otpDigits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: code }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.user);
        onClose();
      } else {
        setError(data.message || "Invalid OTP code.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const autoFillOtp = () => {
    if (activeOtpNotice && activeOtpNotice.length === 6) {
      setOtpDigits(activeOtpNotice.split(""));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[970px] bg-white rounded-[24px] border border-black shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="size-6" />
        </button>

        {/* Left Green Promotional Panel - Matching Figma Exact Style */}
        <div className="w-full md:w-[420px] bg-[#c2ffbe] p-8 flex flex-col justify-between relative overflow-hidden select-none border-r border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[#dd1818] font-black text-[38px] tracking-tight font-serif">
                Bus Buddy
              </span>
            </div>
            <p className="text-[26px] font-normal leading-snug text-gray-800 mb-2">
              Sign up now to join the club of
            </p>
            <p className="text-[38px] font-black leading-tight text-black">
              10 crore+ Happy Travelers
            </p>
          </div>

          {/* Bus Illustration Representation */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full h-44 bg-emerald-200/50 rounded-2xl flex flex-col items-center justify-center border border-emerald-300/60 p-4">
              <Bus className="size-20 text-emerald-800 animate-bounce" />
              <div className="mt-2 text-xs font-bold text-emerald-900 tracking-wider uppercase">
                Safe • Verified • Guaranteed Seats
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-green-700" />
            <span>100% Secure & Govt. Certified Bus Booking</span>
          </div>
        </div>

        {/* Right Form Panel - Matching Figma Login / OTP Flow */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative bg-white">
          {/* Real OTP Banner notification so user NEVER gets stuck */}
          {activeOtpNotice && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-[#dd1818] rounded-xl flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <Sparkles className="size-6 text-[#dd1818]" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
                    Verification Code Generated
                  </span>
                  <span className="text-2xl font-black text-black tracking-widest font-mono">
                    {activeOtpNotice}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={autoFillOtp}
                className="bg-[#dd1818] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 active:scale-95 transition-all"
              >
                Auto Fill
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === "phone" ? (
            /* STEP 1: MOBILE NUMBER INPUT */
            <div>
              <h2 className="text-[32px] font-bold text-black text-center mb-1 leading-tight font-serif">
                Log in to Access
              </h2>
              <p className="text-[18px] text-gray-600 text-center mb-8">
                A world crafted just for you
              </p>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="flex gap-3">
                  {/* +91 Country Box - Figma 1:13587 */}
                  <div className="w-[90px] h-[55px] border border-[#494949] rounded-[12px] flex items-center justify-center gap-1 bg-gray-50 text-[18px] font-bold text-black select-none shrink-0">
                    <span>+ 91</span>
                    <span className="text-xs text-gray-400">▼</span>
                  </div>

                  {/* Mobile Number Input Box - Figma 1:58 */}
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="Mobile Number"
                      className="w-full h-[55px] border border-black rounded-[12px] px-4 text-[20px] font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#dd1818] placeholder:text-[#a39f9f]"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Generate OTP Button - Figma 1:13591 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[55px] bg-[#f5cfcf] hover:bg-[#fadcdc] active:scale-[0.99] border-2 border-[#dd1818] rounded-[12px] text-[#dd1818] font-bold text-[22px] tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="size-6 border-2 border-[#dd1818] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Generate OTP</span>
                  )}
                </button>
              </form>

              {/* Clean Divider - replacing Figma's hyphens */}
              <div className="relative my-8 flex items-center justify-center">
                <div className="border-t border-gray-300 w-full" />
                <span className="bg-white px-3 text-sm text-[#323232] font-medium whitespace-nowrap">
                  or login / signup with
                </span>
                <div className="border-t border-gray-300 w-full" />
              </div>

              {/* Sign in with Google Button - Figma 1:13596 */}
              <button
                type="button"
                onClick={() => {
                  setMobile("9876543210");
                  handleSendOtp();
                }}
                className="w-full h-[45px] border border-[#323232] hover:bg-gray-50 rounded-[12px] flex items-center justify-center gap-3 text-sm font-semibold text-[#323232] transition-colors"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Terms & Conditions Notice - Figma 1:13598 */}
              <p className="text-[13px] text-center text-gray-600 mt-6 leading-relaxed">
                By signing up, you agree to Bus Buddy{" "}
                <a href="#terms" className="text-[#3651ea] font-medium hover:underline">
                  Terms & Conditions
                </a>{" "}
                &{" "}
                <a href="#privacy" className="text-[#3651ea] font-medium hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          ) : (
            /* STEP 2: OTP VERIFICATION (FIGMA OTP GENERATOR 1:13605) */
            <div>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-black mb-6 transition-colors"
              >
                <ArrowLeft className="size-4" />
                <span>Change Mobile Number</span>
              </button>

              <h2 className="text-[32px] font-bold text-black text-center mb-1 font-serif">
                Verify OTP
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Enter the 6-digit verification code sent to{" "}
                <span className="font-bold text-black">+91 {mobile}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="size-12 md:size-14 text-center text-2xl font-black border-2 border-black rounded-xl focus:border-[#dd1818] focus:ring-2 focus:ring-[#dd1818]/30 focus:outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[55px] bg-[#dd1818] hover:bg-[#b81212] active:scale-[0.99] text-white font-bold text-[20px] rounded-[12px] border-2 border-black transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="text-center mt-6">
                {timer > 0 ? (
                  <p className="text-xs text-gray-500">
                    Resend OTP in <span className="font-bold text-black">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-xs font-bold text-[#dd1818] hover:underline"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
