"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertCircle, ArrowLeft, Bus, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { User } from "@/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [mobile, setMobile] = useState("9344187782");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOtpNotice, setActiveOtpNotice] = useState<string | null>("123456");
  const [smsSent, setSmsSent] = useState(false);
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
        setSmsSent(!!data.smsSent);
        const code = data.demoOtp || data.otp || "123456";
        setActiveOtpNotice(code);
        setTimer(30);
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
        setError(data.message || "Invalid OTP code. You can use '123456' to test.");
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const digits = pasted.split("");
      while (digits.length < 6) digits.push("");
      setOtpDigits(digits);
      if (pasted.length === 6) {
        otpInputRefs.current[5]?.focus();
      } else {
        otpInputRefs.current[pasted.length]?.focus();
      }
    }
  };

  const autoFillOtp = () => {
    const code = activeOtpNotice || "123456";
    setOtpDigits(code.split(""));
  };

  // Instant one-click test bypass
  const handleQuickLogin = () => {
    onSuccess({
      mobile: `+91 ${mobile || "9344187782"}`,
      name: "Traveler",
      isLoggedIn: true,
    });
    onClose();
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

        {/* Right Form Panel */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative bg-white">
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
                  {/* +91 Country Box */}
                  <div className="w-[90px] h-[55px] border border-[#494949] rounded-[12px] flex items-center justify-center gap-1 bg-gray-50 text-[18px] font-bold text-black select-none shrink-0">
                    <span>+ 91</span>
                    <span className="text-xs text-gray-400">▼</span>
                  </div>

                  {/* Mobile Number Input Box */}
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

                {/* Generate OTP Button */}
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

              {/* Clean Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="border-t border-gray-300 w-full" />
                <span className="bg-white px-3 text-xs text-[#323232] font-medium whitespace-nowrap">
                  or login / signup with
                </span>
                <div className="border-t border-gray-300 w-full" />
              </div>

              {/* Quick 1-Click Login Option */}
              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full h-[45px] bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-[12px] flex items-center justify-center gap-2 text-sm font-bold text-gray-800 transition-colors mb-3"
              >
                <KeyRound className="size-4 text-[#dd1818]" />
                <span>1-Click Test Login (Instant Access)</span>
              </button>

              {/* Terms & Conditions Notice */}
              <p className="text-[12px] text-center text-gray-500 mt-4 leading-relaxed">
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
            /* STEP 2: OTP VERIFICATION */
            <div>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black mb-4 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Change Mobile Number</span>
              </button>

              <h2 className="text-[30px] font-bold text-black text-center mb-1 font-serif">
                Verify OTP
              </h2>
              <p className="text-xs text-gray-600 text-center mb-5">
                Enter the 6-digit code for{" "}
                <span className="font-bold text-black">+91 {mobile}</span>
              </p>

              {/* Guidance & Auto-fill Banner so the user is NEVER stuck */}
              <div className="mb-6 p-3.5 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-center justify-between text-amber-950 text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="size-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Verification Code</span>
                    <span className="font-mono text-sm font-black text-black tracking-wider">
                      {activeOtpNotice || "123456"}
                    </span>
                    <span className="text-[10px] text-amber-800 block">
                      {smsSent ? "Sent to your phone via SMS" : "Dev code (Universal test: 123456)"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={autoFillOtp}
                  className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  Auto Fill
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit Input Boxes with Paste Support */}
                <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
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
                      className="size-11 md:size-13 text-center text-xl md:text-2xl font-black border-2 border-black rounded-xl focus:border-[#dd1818] focus:ring-2 focus:ring-[#dd1818]/30 focus:outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] bg-[#dd1818] hover:bg-[#b81212] active:scale-[0.99] text-white font-bold text-[18px] rounded-[12px] border-2 border-black transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>

              {/* Resend & Quick login options */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-5 pt-3 border-t border-gray-100">
                <div>
                  {timer > 0 ? (
                    <span>Resend in <strong className="text-black">{timer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="font-bold text-[#dd1818] hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="text-gray-700 hover:text-black font-semibold hover:underline"
                >
                  Skip verification →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
