"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import TopRoutes from "@/components/TopRoutes";
import OurServices from "@/components/OurServices";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import SeatPickerModal from "@/components/SeatPickerModal";
import PaymentModal from "@/components/PaymentModal";
import FinalTicketView from "@/components/FinalTicketView";
import { Bus, User, Passenger, Booking } from "@/types";
import { Star, Wifi, Navigation, BatteryCharging, ArrowRight, Filter, RefreshCw, ShieldCheck, Clock, SlidersHorizontal } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "sleeper" | "seater" | "highRated">("all");
  const [sortBy, setSortBy] = useState<"rating" | "priceLow" | "departure">("rating");

  const [searchParams, setSearchParams] = useState({
    from: "Chennai",
    to: "Bangalore",
    date: new Date().toISOString().split("T")[0],
  });

  // Booking Flow State
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isSeatPickerOpen, setIsSeatPickerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Check persisted session on load
  useEffect(() => {
    const saved = localStorage.getItem("bus_buddy_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("bus_buddy_user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bus_buddy_user");
  };

  const handleSearch = async (from: string, to: string, date: string) => {
    setSearchParams({ from, to, date });
    setIsSearching(true);

    try {
      const res = await fetch(`/api/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await res.json();
      if (data.success && data.buses) {
        setSearchResults(data.buses);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
      const elem = document.getElementById("search-results");
      if (elem) elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setIsSeatPickerOpen(true);
  };

  const handleProceedToPayment = (seats: string[], passList: Passenger[]) => {
    setBookedSeats(seats);
    setPassengers(passList);
    setIsSeatPickerOpen(false);
    setIsPaymentOpen(true);
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setIsPaymentOpen(false);
    setConfirmedBooking(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAnother = () => {
    setConfirmedBooking(null);
    setSelectedBus(null);
    setBookedSeats([]);
    setPassengers([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered & Sorted Search Results (RedBus/MMT Filter Engine)
  const filteredBuses = useMemo(() => {
    if (!searchResults) return null;
    let list = [...searchResults];

    if (filterType === "sleeper") {
      list = list.filter((b) => b.type.toLowerCase().includes("sleeper"));
    } else if (filterType === "seater") {
      list = list.filter((b) => b.type.toLowerCase().includes("seater") || b.type.toLowerCase().includes("semi-sleeper"));
    } else if (filterType === "highRated") {
      list = list.filter((b) => b.rating >= 4.5);
    }

    if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "priceLow") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "departure") {
      list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    return list;
  }, [searchResults, filterType, sortBy]);

  // If a booking is confirmed, display the exact Figma Final Ticket Boarding Pass
  if (confirmedBooking) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar
          user={user}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
        />
        <FinalTicketView
          booking={confirmedBooking}
          onBookAnother={handleBookAnother}
        />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section with Search Box */}
      <HeroSearch onSearch={handleSearch} />

      {/* RedBus / MakeMyTrip-Style Search Results & Filter Engine */}
      {searchResults && (
        <section id="search-results" className="py-12 bg-gray-50 border-t border-b border-gray-200">
          <div className="max-w-[1512px] mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-serif text-black">
                  Available Buses ({filteredBuses?.length || 0})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing buses from <strong className="text-black">{searchParams.from}</strong> to{" "}
                  <strong className="text-black">{searchParams.to}</strong> on {searchParams.date}
                </p>
              </div>

              {/* RedBus-Grade Quick Filters & Sorting Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl p-1 shadow-sm text-xs font-bold">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "all" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    All Buses
                  </button>
                  <button
                    onClick={() => setFilterType("sleeper")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "sleeper" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    AC Sleeper
                  </button>
                  <button
                    onClick={() => setFilterType("seater")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "seater" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    Seater / Semi
                  </button>
                  <button
                    onClick={() => setFilterType("highRated")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "highRated" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    ★ 4.5+ Rated
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#dd1818] shadow-sm"
                >
                  <option value="rating">Sort: Top Rated</option>
                  <option value="priceLow">Sort: Lowest Price</option>
                  <option value="departure">Sort: Departure Time</option>
                </select>

                <button
                  onClick={() => handleSearch(searchParams.from, searchParams.to, searchParams.date)}
                  className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-sm"
                >
                  <RefreshCw className={`size-3.5 ${isSearching ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Bus Cards List */}
            <div className="space-y-5">
              {filteredBuses && filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-xl transition-all flex flex-col lg:flex-row items-center justify-between gap-6 relative group"
                  >
                    {/* Bus Operator & Features */}
                    <div className="space-y-2 flex-1 w-full lg:w-auto">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-black font-serif">{bus.name}</h3>
                        <div className="bg-[#007d13] text-white px-2 py-0.5 rounded text-xs font-extrabold flex items-center gap-1">
                          <Star className="size-3 fill-white" />
                          <span>{bus.rating.toFixed(1)}</span>
                        </div>
                        <span className="bg-red-50 text-[#dd1818] text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                          Thangavelu Certified
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 font-medium">
                        {bus.type} • Vehicle No: <strong className="text-black">{bus.busNumber}</strong>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                        {bus.amenities.wifi && <span className="flex items-center gap-1"><Wifi className="size-3.5 text-blue-600" /> Free Wi-Fi</span>}
                        {bus.amenities.tracking && <span className="flex items-center gap-1"><Navigation className="size-3.5 text-purple-600" /> Live Tracking</span>}
                        {bus.amenities.charging && <span className="flex items-center gap-1"><BatteryCharging className="size-3.5 text-amber-600" /> USB Port</span>}
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <ShieldCheck className="size-3.5" /> Free Cancellation up to 6h before
                        </span>
                      </div>
                    </div>

                    {/* Route Timings & Timeline */}
                    <div className="flex items-center gap-8 text-center w-full lg:w-auto justify-between lg:justify-center border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                      <div>
                        <span className="text-2xl font-black text-black font-mono">{bus.departureTime}</span>
                        <span className="text-xs font-bold text-gray-700 block">{bus.from}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 font-semibold mb-0.5">{bus.duration}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-0.5 bg-gray-300" />
                          <div className="size-2 rounded-full bg-[#dd1818]" />
                          <div className="w-12 h-0.5 bg-gray-300" />
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5">Non-Stop</span>
                      </div>

                      <div>
                        <span className="text-2xl font-black text-black font-mono">{bus.arrivalTime}</span>
                        <span className="text-xs font-bold text-gray-700 block">{bus.to}</span>
                      </div>
                    </div>

                    {/* Price & Select Seats CTA */}
                    <div className="flex items-center gap-6 lg:border-l lg:border-gray-200 lg:pl-8 w-full lg:w-auto justify-between lg:justify-start border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400 block">Starting from</span>
                        <span className="text-2xl font-black text-black font-mono">₹ {bus.price}</span>
                        <span className="text-[11px] text-emerald-600 font-bold block">{bus.availableSeatsCount} seats available</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectBus(bus)}
                        className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl border-2 border-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <span>Select Seats</span>
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
                  <p className="text-base font-bold text-gray-700 mb-2">No buses match the selected filter.</p>
                  <button
                    onClick={() => setFilterType("all")}
                    className="text-xs font-bold text-[#dd1818] hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Top Search Routes (Exact Figma Section) */}
      <TopRoutes onSelectBus={handleSelectBus} />

      {/* Our Services (Exact Figma Section) */}
      <OurServices />

      {/* Footer */}
      <Footer />

      {/* Login & OTP Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Seat Picker Modal */}
      <SeatPickerModal
        isOpen={isSeatPickerOpen}
        bus={selectedBus}
        travelDate={searchParams.date}
        onClose={() => setIsSeatPickerOpen(false)}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        bus={selectedBus}
        travelDate={searchParams.date}
        selectedSeats={bookedSeats}
        passengers={passengers}
        onClose={() => setIsPaymentOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />
    </main>
  );
}
