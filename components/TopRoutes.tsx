"use client";

import React from "react";
import { Star, Wifi, Navigation, BatteryCharging, ArrowRight, Flame, Award, Zap } from "lucide-react";
import { Bus } from "@/types";

interface TopRoutesProps {
  onSelectBus: (bus: Bus) => void;
}

const MOST_BOOKED_ROUTES: Bus[] = [
  {
    id: "bus-1",
    name: "Thangavelu Travels (Bus Buddy Express)",
    busNumber: "TN 38 BB 1024",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Chennai",
    to: "Bangalore",
    departureTime: "23 : 15",
    arrivalTime: "05 : 45",
    duration: "06h.35m",
    price: 1800,
    rating: 4.9,
    bookedCount: 1840,
    isRecommended: true,
    popularityBadge: "🔥 #1 Most Booked",
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 14,
  },
  {
    id: "bus-2",
    name: "Thangavelu Super Luxury",
    busNumber: "TN 37 TL 8821",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Coimbatore",
    to: "Nagarkovil",
    departureTime: "23 : 15",
    arrivalTime: "05 : 45",
    duration: "06h.35m",
    price: 1350,
    rating: 4.6,
    bookedCount: 1290,
    isRecommended: true,
    popularityBadge: "👑 Top Recommended",
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 19,
  },
  {
    id: "bus-5",
    name: "Thangavelu Royal Travels",
    busNumber: "TN 59 BB 3341",
    type: "A/C Sleeper (2+1)",
    from: "Madurai",
    to: "Chennai",
    departureTime: "22 : 00",
    arrivalTime: "05 : 30",
    duration: "07h.30m",
    price: 1200,
    rating: 4.5,
    bookedCount: 1150,
    isRecommended: true,
    popularityBadge: "⚡ High Demand",
    amenities: { wifi: true, charging: true, tracking: true, snacks: false },
    totalSeats: 36,
    availableSeatsCount: 22,
  },
];

export default function TopRoutes({ onSelectBus }: TopRoutesProps) {
  return (
    <section id="routes" className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Section Heading - Exact Figma 1:13317 */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#dd1818] border border-red-200 rounded-full text-xs font-bold mb-2">
            <Flame className="size-3.5 fill-[#dd1818]" />
            <span>Travellers Choice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[46px] font-bold text-black font-serif">
            Top Search <span className="text-[#dd1818]">Recommended Routes</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-sans">
            Ranked by the most booked buses with highest customer satisfaction
          </p>
        </div>

        {/* 3 Top Search Cards - Exact Figma Dimensions & Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {MOST_BOOKED_ROUTES.map((route, idx) => (
            <div
              key={route.id}
              className={`w-full max-w-[420px] lg:max-w-[460px] min-h-[270px] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 bg-white relative group ${
                idx === 0
                  ? "border-2 border-[#dd1818] shadow-lg"
                  : "border border-[#867f7f]"
              }`}
            >
              {/* Popularity Banner Badge on Top */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    idx === 0
                      ? "bg-red-50 text-[#dd1818] border border-red-200"
                      : idx === 1
                      ? "bg-amber-50 text-amber-900 border border-amber-200"
                      : "bg-blue-50 text-blue-900 border border-blue-200"
                  }`}
                >
                  {route.popularityBadge}
                </span>

                <span className="text-[11px] font-semibold text-gray-500">
                  {route.bookedCount?.toLocaleString()}+ booked
                </span>
              </div>

              {/* Header: From / To with Direction */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-1">
                  <span>From</span>
                  <span>To</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl sm:text-[22px] font-bold text-black font-serif">
                    {route.from}
                  </span>

                  {/* Connecting Timeline - Figma Line & Pill */}
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[11px] font-semibold text-gray-500 mb-0.5">
                      {route.duration}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-8 sm:w-10 h-0.5 bg-gray-300" />
                      <div className="size-2 rounded-full bg-[#dd1818]" />
                      <div className="w-8 sm:w-10 h-0.5 bg-gray-300" />
                    </div>
                  </div>

                  <span className="text-xl sm:text-[22px] font-bold text-black font-serif">
                    {route.to}
                  </span>
                </div>

                {/* Departure / Arrival Times */}
                <div className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2 font-mono">
                  <span>{route.departureTime}</span>
                  <span>{route.arrivalTime}</span>
                </div>

                {/* Bus Type */}
                <p className="text-xs text-gray-600 font-medium mb-3 truncate">
                  {route.type}
                </p>

                {/* Rating Badge & Amenities */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    {/* Green Rating Badge - Figma 1:13303 */}
                    <div className="bg-[#007d13] text-white px-2 py-0.5 rounded-[5px] flex items-center gap-1 font-extrabold text-xs">
                      <Star className="size-3 fill-white" />
                      <span>{route.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex items-center gap-2.5 text-gray-500 text-xs">
                    <div className="flex items-center gap-1" title="Free Wi-Fi">
                      <Wifi className="size-3.5 text-blue-600" />
                      <span className="hidden sm:inline text-[11px]">Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-1" title="Live Tracking">
                      <Navigation className="size-3.5 text-purple-600" />
                      <span className="hidden sm:inline text-[11px]">Track</span>
                    </div>
                    <div className="flex items-center gap-1" title="Charging Point">
                      <BatteryCharging className="size-3.5 text-amber-600" />
                      <span className="hidden sm:inline text-[11px]">Power</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Price & Select Seats Button - Figma 1:186 */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <div>
                  <span className="text-[10px] text-gray-400 block">Fare</span>
                  <div className="text-2xl sm:text-[26px] font-black text-black font-mono leading-none">
                    ₹ {route.price}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBus(route)}
                  className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white border-2 border-black rounded-[12px] px-5 py-2 font-bold text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Seats</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
