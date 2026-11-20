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
import InstallPwaModal from "@/components/InstallPwaModal";
import { Bus, User, Passenger, Booking } from "@/types";
import { Star, Wifi, Navigation, BatteryCharging, ArrowRight, RefreshCw, ShieldCheck, Flame } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState<string | undefined>(undefined);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Bus[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "sleeper" | "seater" | "highRated">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "priceLow" | "departure">("recommended");

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

    // If user clicked "Select Seats" before logging in, automatically open seat picker now!
    if (selectedBus) {
      setIsSeatPickerOpen(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bus_buddy_user");
    setIsSeatPickerOpen(false);
    setIsPaymentOpen(false);
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

  // ENFORCE MANDATORY LOGIN BEFORE BOOKING
  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);

    if (!user || !user.isLoggedIn) {
      setLoginReason("Please log in with your mobile number to select seats and book your bus ticket.");
      setIsLoginOpen(true);
      return;
    }

    setIsSeatPickerOpen(true);
  };

  const handleProceedToPayment = (seats: string[], passList: Passenger[]) => {
    if (!user || !user.isLoggedIn) {
      setLoginReason("Please log in to proceed to payment.");
      setIsLoginOpen(true);
      return;
    }

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

  // Filtered & Sorted Search Results - Most Booked (Recommended) First
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

    if (sortBy === "recommended") {
      list.sort((a, b) => (b.bookedCount || 0) - (a.bookedCount || 0));
    } else if (sortBy === "rating") {
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
          onOpenLogin={() => {
            setLoginReason(undefined);
            setIsLoginOpen(true);
          }}
          onLogout={handleLogout}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />
        <FinalTicketView
          booking={confirmedBooking}
          onBookAnother={handleBookAnother}
        />
        <Footer />
        <InstallPwaModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        onOpenLogin={() => {
          setLoginReason(undefined);
          setIsLoginOpen(true);
        }}
        onLogout={handleLogout}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Hero Section with Search Box */}
      <HeroSearch onSearch={handleSearch} />

      {/* Search Results */}
      {searchResults && (
        <section id="search-results" className="py-12 bg-gray-50 border-t border-b border-gray-200">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#dd1818] border border-red-200 rounded-full text-xs font-bold mb-2">
                  <Flame className="size-3.5 fill-[#dd1818]" />
                  <span>Showing Top Recommended & Most Booked Buses First</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black">
                  Available Buses ({filteredBuses?.length || 0})
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Showing buses from <strong className="text-black">{searchParams.from}</strong> to{" "}
                  <strong className="text-black">{searchParams.to}</strong> on {searchParams.date}
                </p>
              </div>

              {/* Quick Filters & Sorting Controls */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-xl p-1 shadow-sm text-xs font-bold">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "all" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType("sleeper")}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "sleeper" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    Sleeper
                  </button>
                  <button
                    onClick={() => setFilterType("seater")}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "seater" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    Seater
                  </button>
                  <button
                    onClick={() => setFilterType("highRated")}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "highRated" ? "bg-[#dd1818] text-white" : "text-gray-700 hover:text-black"}`}
                  >
                    ★ 4.5+
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-gray-300 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#dd1818] shadow-sm cursor-pointer"
                >
                  <option value="recommended">🔥 Sort: Most Booked (Recommended)</option>
                  <option value="rating">★ Sort: Top Rated</option>
                  <option value="priceLow">₹ Sort: Lowest Price</option>
                  <option value="departure">🕒 Sort: Departure Time</option>
                </select>

                <button
                  onClick={() => handleSearch(searchParams.from, searchParams.to, searchParams.date)}
                  className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm cursor-pointer"
                >
                  <RefreshCw className={`size-3.5 ${isSearching ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Bus Cards List */}
            <div className="space-y-4 sm:space-y-5">
              {filteredBuses && filteredBuses.length > 0 ? (
                filteredBuses.map((bus, idx) => (
                  <div
                    key={bus.id}
                    className={`bg-white rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all flex flex-col lg:flex-row items-center justify-between gap-6 relative group ${
                      idx === 0 && sortBy === "recommended"
                        ? "border-2 border-[#dd1818] shadow-md ring-1 ring-red-100"
                        : "border border-gray-300"
                    }`}
                  >
                    {/* Bus Operator & Features */}
                    <div className="space-y-2 flex-1 w-full lg:w-auto">
                      {/* Popularity Badge & Booking Stats */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {bus.popularityBadge && (
                          <span
                            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              idx === 0
                                ? "bg-red-50 text-[#dd1818] border border-red-300"
                                : "bg-amber-50 text-amber-900 border border-amber-300"
                            }`}
                          >
                            <Flame className="size-3 fill-current" />
                            <span>{bus.popularityBadge}</span>
                          </span>
                        )}

                        {bus.bookedCount && (
                          <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            {bus.bookedCount.toLocaleString()}+ travelers booked
                          </span>
                        )}

                        {bus.availableSeatsCount <= 8 && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                            Fast Filling!
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-black font-serif">{bus.name}</h3>
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

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-600 pt-1">
                        {bus.amenities.wifi && <span className="flex items-center gap-1"><Wifi className="size-3.5 text-blue-600" /> Free Wi-Fi</span>}
                        {bus.amenities.tracking && <span className="flex items-center gap-1"><Navigation className="size-3.5 text-purple-600" /> Live Tracking</span>}
                        {bus.amenities.charging && <span className="flex items-center gap-1"><BatteryCharging className="size-3.5 text-amber-600" /> USB Port</span>}
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <ShieldCheck className="size-3.5" /> Free Cancellation
                        </span>
                      </div>
                    </div>

                    {/* Route Timings & Timeline */}
                    <div className="flex items-center gap-6 sm:gap-8 text-center w-full lg:w-auto justify-between lg:justify-center border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-black font-mono">{bus.departureTime}</span>
                        <span className="text-xs font-bold text-gray-700 block">{bus.from}</span>
                      </div>

                      <div className="flex flex-col items-center px-1">
                        <span className="text-xs text-gray-500 font-semibold mb-0.5">{bus.duration}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
                          <div className="size-2 rounded-full bg-[#dd1818]" />
                          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5">Non-Stop</span>
                      </div>

                      <div>
                        <span className="text-xl sm:text-2xl font-black text-black font-mono">{bus.arrivalTime}</span>
                        <span className="text-xs font-bold text-gray-700 block">{bus.to}</span>
                      </div>
                    </div>

                    {/* Price & Select Seats CTA */}
                    <div className="flex items-center gap-5 sm:gap-6 lg:border-l lg:border-gray-200 lg:pl-6 w-full lg:w-auto justify-between lg:justify-start border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                      <div>
                        <span className="text-[11px] text-gray-400 block">Starting from</span>
                        <span className="text-xl sm:text-2xl font-black text-black font-mono">₹ {bus.price}</span>
                        <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold block">{bus.availableSeatsCount} seats available</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectBus(bus)}
                        className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-black transition-all shadow-md flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                      >
                        <span>Select Seats</span>
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 sm:p-12 text-center bg-white border border-gray-200 rounded-2xl">
                  <p className="text-sm sm:text-base font-bold text-gray-700 mb-2">No buses match the selected filter.</p>
                  <button
                    onClick={() => setFilterType("all")}
                    className="text-xs font-bold text-[#dd1818] hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Top Search Routes */}
      <TopRoutes onSelectBus={handleSelectBus} />

      {/* Our Services */}
      <OurServices />

      {/* Footer */}
      <Footer />

      {/* Login & OTP Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        reason={loginReason}
        onClose={() => {
          setIsLoginOpen(false);
          setLoginReason(undefined);
        }}
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

      {/* Install PWA Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </main>
  );
}
