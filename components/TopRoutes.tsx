"use client";

import React from "react";
import { Star, Wifi, Navigation, Coffee, BatteryCharging, ArrowRight } from "lucide-react";
import { Bus } from "@/types";

interface TopRoutesProps {
  onSelectBus: (bus: Bus) => void;
}

const FEATURED_ROUTES: Bus[] = [
  {
    id: "bus-1",
    name: "Thangavelu Travels (Bus Buddy)",
    busNumber: "TN 38 BB 1024",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Chennai",
    to: "Bangalore",
    departureTime: "23 : 15",
    arrivalTime: "05 : 45",
    duration: "06h.35m",
    price: 1800,
    rating: 4.9,
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 14,
  },
  {
    id: "bus-2",
    name: "Thangavelu Luxury",
    busNumber: "TN 37 TL 8821",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Coimbatore",
    to: "Nagarkovil",
    departureTime: "23 : 15",
    arrivalTime: "05 : 45",
    duration: "06h.35m",
    price: 1350,
    rating: 4.0,
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 19,
  },
  {
    id: "bus-3",
    name: "Thangavelu Premium",
    busNumber: "TN 63 BB 4590",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Coimbatore",
    to: "Karaikudi",
    departureTime: "23 : 15",
    arrivalTime: "05 : 45",
    duration: "07h.45m",
    price: 1700,
    rating: 4.2,
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 11,
  },
];

export default function TopRoutes({ onSelectBus }: TopRoutesProps) {
  return (
    <section id="routes" className="w-full py-16 bg-white">
      <div className="max-w-[1512px] mx-auto px-6">
        {/* Section Heading - Exact Figma 1:13317 */}
        <div className="text-center mb-12">
          <h2 className="text-[42px] md:text-[50px] font-bold text-black font-serif">
            Top Search <span className="text-[#dd1818]">Routes</span>
          </h2>
        </div>

        {/* 3 Top Search Cards - Exact Figma Dimensions (460x242) and Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {FEATURED_ROUTES.map((route) => (
            <div
              key={route.id}
              className="w-full max-w-[460px] h-[255px] border border-[#867f7f] rounded-[16px] p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white relative group"
            >
              {/* Header: From / To with Direction */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-1">
                  <span>From</span>
                  <span>To</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[22px] font-bold text-black font-serif">
                    {route.from}
                  </span>

                  {/* Connecting Timeline - Figma Line & Pill */}
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[11px] font-semibold text-gray-500 mb-0.5">
                      {route.duration}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-10 h-0.5 bg-gray-300" />
                      <div className="size-2 rounded-full bg-[#dd1818]" />
                      <div className="w-10 h-0.5 bg-gray-300" />
                    </div>
                  </div>

                  <span className="text-[22px] font-bold text-black font-serif">
                    {route.to}
                  </span>
                </div>

                {/* Departure / Arrival Times */}
                <div className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
                  <span>{route.departureTime}</span>
                  <span>{route.arrivalTime}</span>
                </div>

                {/* Bus Type */}
                <p className="text-xs text-gray-600 font-medium mb-3">
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
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <div className="flex items-center gap-1" title="Free Wi-Fi">
                      <Wifi className="size-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-1" title="Live Tracking">
                      <Navigation className="size-3.5 text-purple-600" />
                      <span className="hidden sm:inline">Tracking</span>
                    </div>
                    <div className="flex items-center gap-1" title="Charging Point">
                      <BatteryCharging className="size-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Charging</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Price & Select Seats Button - Figma 1:186 */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                <div className="text-[24px] font-bold text-black font-mono">
                  ₹ {route.price}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBus(route)}
                  className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white border-2 border-black rounded-[12px] px-6 py-2 font-bold text-sm transition-all shadow-sm flex items-center gap-1.5"
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
