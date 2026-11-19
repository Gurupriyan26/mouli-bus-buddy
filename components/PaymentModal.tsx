"use client";

import React, { useState } from "react";
import { X, QrCode, CreditCard, Building2, Wallet, Clock, Percent, ShieldCheck, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { Bus, Passenger, Booking } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  bus: Bus | null;
  travelDate: string;
  selectedSeats: string[];
  passengers: Passenger[];
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export default function PaymentModal({
  isOpen,
  bus,
  travelDate,
  selectedSeats,
  passengers,
  onClose,
  onBookingConfirmed,
}: PaymentModalProps) {
  const [method, setMethod] = useState<"UPI" | "Card" | "NetBanking" | "Wallet" | "PayLater" | "EMI">("UPI");
  const [upiId, setUpiId] = useState("user@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8921");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("•••");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bus) return null;

  const seatPrice = bus.price;
  const baseFare = seatPrice * selectedSeats.length;
  const gst = Math.round(baseFare * 0.05);
  const totalFare = baseFare + gst;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bus,
          travelDate,
          passengers,
          selectedSeats,
          paymentMethod: method,
        }),
      });

      const data = await res.json();

      if (data.success && data.booking) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          setIsProcessing(false);
          onBookingConfirmed(data.booking);
        }, 1200);
      } else {
        setError(data.message || "Payment could not be completed.");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Payment processing error. Please try again.");
      setIsProcessing(false);
    }
  };

  const paymentTabs = [
    { id: "UPI", label: "UPI (GPay / PhonePe)", icon: QrCode },
    { id: "Card", label: "Credit / Debit Card", icon: CreditCard },
    { id: "NetBanking", label: "Net Banking", icon: Building2 },
    { id: "Wallet", label: "Wallets (Paytm / Amazon)", icon: Wallet },
    { id: "PayLater", label: "Pay Later", icon: Clock },
    { id: "EMI", label: "EMI Options", icon: Percent },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[850px] bg-white rounded-[24px] border border-black shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#dd1818] text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-serif">Complete Payment</h2>
            <p className="text-xs text-white/80 mt-1">
              Total Payable: <span className="font-bold font-mono text-base">₹ {totalFare}</span> • Booking for {selectedSeats.length} seat(s)
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Payment Method Tabs (Figma 1:1824, 1:1720, etc.) */}
          <div className="md:col-span-5 border-r border-gray-200 pr-4 space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
              Payment Options
            </span>
            {paymentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = method === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMethod(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left text-sm font-bold transition-all border ${
                    isActive
                      ? "bg-red-50 border-[#dd1818] text-[#dd1818] shadow-sm"
                      : "border-transparent text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`size-5 ${isActive ? "text-[#dd1818]" : "text-gray-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Selected Gateway Content */}
          <div className="md:col-span-7 flex flex-col justify-between">
            {method === "UPI" && (
              <div className="space-y-5">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                  <div className="size-40 bg-white border-2 border-black rounded-xl p-3 shadow-inner flex items-center justify-center mb-3">
                    <QrCode className="size-32 text-black" />
                  </div>
                  <span className="text-xs font-bold text-gray-600 uppercase">
                    Scan with any UPI App (GPay, PhonePe, Paytm)
                  </span>
                  <span className="text-sm font-mono font-bold text-black mt-1">
                    UPI ID: busbuddy@thangavelu
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                    Or Enter Your UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full h-11 px-3 border border-black rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === "Card" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9101 1121"
                    className="w-full h-11 px-3 border border-black rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full h-11 px-3 border border-black rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full h-11 px-3 border border-black rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {method !== "UPI" && method !== "Card" && (
              <div className="p-8 border border-gray-200 rounded-xl bg-gray-50 text-center space-y-3">
                <ShieldCheck className="size-12 text-[#dd1818] mx-auto" />
                <h4 className="font-bold text-black text-lg">{method} Gateway Active</h4>
                <p className="text-xs text-gray-600">
                  You will be securely redirected to complete your {method} verification.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full h-14 bg-[#dd1818] hover:bg-[#b81212] active:scale-[0.99] text-white font-bold text-xl rounded-xl transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </div>
                ) : (
                  <span>Pay ₹ {totalFare} Securely</span>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted • Instant Boarding Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
