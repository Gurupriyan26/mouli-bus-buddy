"use client";

import React, { useState } from "react";
import { X, Check, AlertCircle, ArrowRight, UserCheck, Shield } from "lucide-react";
import { Bus, Passenger } from "@/types";

interface SeatPickerModalProps {
  isOpen: boolean;
  bus: Bus | null;
  travelDate: string;
  onClose: () => void;
  onProceedToPayment: (selectedSeats: string[], passengers: Passenger[]) => void;
}

export default function SeatPickerModal({
  isOpen,
  bus,
  travelDate,
  onClose,
  onProceedToPayment,
}: SeatPickerModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [currentDeck, setCurrentDeck] = useState<"lower" | "upper">("lower");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bus) return null;

  // Seat matrix data
  // Lower deck seats: L1 to L18
  // Upper deck sleeper berths: U1 to U18
  const bookedSeats = ["L2", "L5", "L9", "L14", "U3", "U7", "U12", "U15"];

  const lowerDeckRows = [
    { row: 1, left: ["L1", "L2"], right: ["L3"] },
    { row: 2, left: ["L4", "L5"], right: ["L6"] },
    { row: 3, left: ["L7", "L8"], right: ["L9"] },
    { row: 4, left: ["L10", "L11"], right: ["L12"] },
    { row: 5, left: ["L13", "L14"], right: ["L15"] },
    { row: 6, left: ["L16", "L17"], right: ["L18"] },
  ];

  const upperDeckRows = [
    { row: 1, left: ["U1", "U2"], right: ["U3"] },
    { row: 2, left: ["U4", "U5"], right: ["U6"] },
    { row: 3, left: ["U7", "U8"], right: ["U9"] },
    { row: 4, left: ["U10", "U11"], right: ["U12"] },
    { row: 5, left: ["U13", "U14"], right: ["U15"] },
    { row: 6, left: ["U16", "U17"], right: ["U18"] },
  ];

  const toggleSeat = (seatNo: string) => {
    if (bookedSeats.includes(seatNo)) return;

    if (selectedSeats.includes(seatNo)) {
      const updated = selectedSeats.filter((s) => s !== seatNo);
      setSelectedSeats(updated);
      setPassengers(passengers.filter((p) => p.seatNumber !== seatNo));
    } else {
      if (selectedSeats.length >= 6) {
        setError("You can select a maximum of 6 seats per booking.");
        return;
      }
      setError(null);
      const updated = [...selectedSeats, seatNo];
      setSelectedSeats(updated);
      setPassengers([
        ...passengers,
        {
          name: "",
          age: "",
          gender: "Male",
          seatNumber: seatNo,
        },
      ]);
    }
  };

  const handlePassengerChange = (
    seatNo: string,
    field: keyof Passenger,
    value: any
  ) => {
    setPassengers((prev) =>
      prev.map((p) => (p.seatNumber === seatNo ? { ...p, [field]: value } : p))
    );
  };

  const handleContinue = () => {
    setError(null);
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat to continue.");
      return;
    }

    // Validate passenger info
    for (const p of passengers) {
      if (!p.name || p.name.trim().length < 2) {
        setError(`Please enter the passenger name for seat ${p.seatNumber}.`);
        return;
      }
      if (!p.age || Number(p.age) <= 0 || Number(p.age) > 120) {
        setError(`Please enter a valid age for seat ${p.seatNumber}.`);
        return;
      }
    }

    onProceedToPayment(selectedSeats, passengers);
  };

  const seatPrice = bus.price;
  const baseFare = seatPrice * selectedSeats.length;
  const gst = Math.round(baseFare * 0.05);
  const totalFare = baseFare + gst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[1100px] bg-white rounded-[24px] border border-black shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#dd1818] text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold font-serif">Select Your Seats</h2>
              <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-semibold">
                {bus.from} → {bus.to}
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1">
              {bus.name} ({bus.busNumber}) • Travel Date: {travelDate} • Departure: {bus.departureTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Bus Seat Layout (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Deck Selector Tabs */}
            <div className="flex items-center gap-3 mb-6 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentDeck("lower")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentDeck === "lower"
                    ? "bg-[#dd1818] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Lower Deck (Seater)
              </button>
              <button
                type="button"
                onClick={() => setCurrentDeck("upper")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentDeck === "upper"
                    ? "bg-[#dd1818] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Upper Deck (Sleeper)
              </button>
            </div>

            {/* Seat Map Legend */}
            <div className="flex items-center gap-6 mb-6 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <div className="size-5 rounded border-2 border-gray-400 bg-white" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-5 rounded bg-gray-300 border border-gray-400" />
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-5 rounded bg-[#dd1818] text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>Selected</span>
              </div>
            </div>

            {/* Bus Body Layout Container */}
            <div className="w-full max-w-[380px] bg-gray-50 border-2 border-gray-800 rounded-3xl p-6 relative shadow-inner">
              {/* Driver Steering wheel indicator */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b-2 border-dashed border-gray-300 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>Front</span>
                <span className="flex items-center gap-1">
                  🛞 Driver Side
                </span>
              </div>

              {/* Rows layout */}
              <div className="space-y-4">
                {(currentDeck === "lower" ? lowerDeckRows : upperDeckRows).map(
                  (rowItem) => (
                    <div
                      key={rowItem.row}
                      className="flex items-center justify-between"
                    >
                      {/* Left 2 seats */}
                      <div className="flex gap-2">
                        {rowItem.left.map((seatNo) => {
                          const isBooked = bookedSeats.includes(seatNo);
                          const isSelected = selectedSeats.includes(seatNo);
                          return (
                            <button
                              key={seatNo}
                              type="button"
                              disabled={isBooked}
                              onClick={() => toggleSeat(seatNo)}
                              className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all border-2 ${
                                isSelected
                                  ? "bg-[#dd1818] text-white border-black scale-105 shadow-md"
                                  : isBooked
                                  ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                  : "bg-white text-gray-900 border-gray-400 hover:border-[#dd1818] hover:shadow"
                              }`}
                            >
                              <span>{seatNo}</span>
                              <span className="text-[9px] font-normal opacity-80">
                                {currentDeck === "upper" ? "Sleep" : "Seat"}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Walkway Aisle */}
                      <div className="w-6 border-r border-dashed border-gray-300 h-14" />

                      {/* Right 1 seat */}
                      <div className="flex gap-2">
                        {rowItem.right.map((seatNo) => {
                          const isBooked = bookedSeats.includes(seatNo);
                          const isSelected = selectedSeats.includes(seatNo);
                          return (
                            <button
                              key={seatNo}
                              type="button"
                              disabled={isBooked}
                              onClick={() => toggleSeat(seatNo)}
                              className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center font-bold text-xs transition-all border-2 ${
                                isSelected
                                  ? "bg-[#dd1818] text-white border-black scale-105 shadow-md"
                                  : isBooked
                                  ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                  : "bg-white text-gray-900 border-gray-400 hover:border-[#dd1818] hover:shadow"
                              }`}
                            >
                              <span>{seatNo}</span>
                              <span className="text-[9px] font-normal opacity-80">
                                {currentDeck === "upper" ? "Sleep" : "Seat"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Passenger Info & Fare Breakdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-black mb-3 font-serif flex items-center gap-2">
                <UserCheck className="size-5 text-[#dd1818]" />
                <span>Passenger Details</span>
              </h3>

              {selectedSeats.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-500 text-sm">
                  Click on any available seat on the bus to add passenger details.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {passengers.map((p, idx) => (
                    <div
                      key={p.seatNumber}
                      className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#dd1818]">Passenger {idx + 1}</span>
                        <span className="bg-black text-white px-2 py-0.5 rounded">
                          Seat: {p.seatNumber}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={p.name}
                          onChange={(e) =>
                            handlePassengerChange(p.seatNumber, "name", e.target.value)
                          }
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Age"
                            value={p.age}
                            onChange={(e) =>
                              handlePassengerChange(p.seatNumber, "age", e.target.value)
                            }
                            className="w-24 h-10 px-3 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none"
                          />
                          <select
                            value={p.gender}
                            onChange={(e) =>
                              handlePassengerChange(p.seatNumber, "gender", e.target.value)
                            }
                            className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#dd1818] focus:outline-none bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fare Breakdown Card - Matching Figma Fare Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Fare Breakdown
              </h4>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Selected Seats</span>
                <span className="font-bold text-black font-mono">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"} ({selectedSeats.length})
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Base Fare (₹{seatPrice} × {selectedSeats.length})</span>
                <span className="font-bold text-black font-mono">₹ {baseFare}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span className="font-bold text-black font-mono">₹ {gst}</span>
              </div>

              <div className="border-t border-gray-300 pt-3 flex justify-between items-center text-lg font-bold text-black">
                <span>Total Amount</span>
                <span className="text-[#dd1818] font-mono text-2xl">
                  ₹ {totalFare}
                </span>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-12 bg-[#dd1818] hover:bg-[#b81212] active:scale-[0.99] text-white font-bold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
