"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, ArrowRightLeft, Search } from "lucide-react";

interface HeroSearchProps {
  onSearch: (from: string, to: string, date: string) => void;
}

const POPULAR_CITIES = [
  { name: "Chennai", desc: "Koyambedu, Tambaram, Guindy" },
  { name: "Bangalore", desc: "Majestic, Electronic City, Silk Board" },
  { name: "Coimbatore", desc: "Gandhipuram, Omni Bus Stand" },
  { name: "Madurai", desc: "Mattuthavani, Periyar" },
  { name: "Hyderabad", desc: "MGBS, Ameerpet, Gachibowli" },
  { name: "Salem", desc: "New Bus Stand, AVR Roundana" },
  { name: "Trichy", desc: "Central Bus Stand, Chatram" },
  { name: "Karaikudi", desc: "New Bus Stand, College Road" },
  { name: "Nagarkovil", desc: "Vadasery Bus Stand" },
];

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const [from, setFrom] = useState("Chennai");
  const [to, setTo] = useState("Bangalore");
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });

  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const setDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    onSearch(from, to, date);
  };

  // Format date display nicely (e.g., "Nov 21, 2026")
  const formattedDate = (() => {
    try {
      const parts = date.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      return date;
    } catch {
      return date;
    }
  })();

  return (
    <section id="hero" className="relative w-full pt-8 pb-12 sm:pb-16 bg-gradient-to-b from-red-50/40 via-white to-white overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Subtitle - Exact Figma font & style */}
        <p className="text-lg sm:text-xl md:text-2xl font-normal text-black/70 mb-2 font-sans tracking-wide text-center">
          Get your bus tickets
        </p>

        {/* Main Title - Responsive & centered */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-black text-center mb-8 md:mb-10 tracking-tight leading-tight font-serif px-2">
          Find Best Bus For You !
        </h1>

        {/* Bus Search Box Card - Fully Responsive with Figma Exact Styling & Shadow */}
        <div className="w-full max-w-[1240px] bg-white border border-[#a39f9f] rounded-[24px] md:rounded-[28px] shadow-[6px_10px_0px_0px_#a39f9f] md:shadow-[10px_15px_5px_0px_#a39f9f] p-4 sm:p-6 lg:p-7 relative z-20">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-3 lg:gap-3 w-full">
            {/* Starting Point */}
            <div ref={fromRef} className="relative w-full lg:flex-[1.2] min-w-0">
              <div
                onClick={() => setShowFromSuggestions(true)}
                className="w-full h-[62px] border border-black rounded-[12px] flex items-center px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#dd1818] cursor-text"
              >
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Starting Point
                  </label>
                  <input
                    type="text"
                    value={from}
                    onFocus={() => setShowFromSuggestions(true)}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setShowFromSuggestions(true);
                    }}
                    placeholder="e.g. Chennai"
                    className="w-full text-base sm:text-[18px] font-bold text-black focus:outline-none placeholder:text-[#a39f9f] bg-transparent truncate"
                  />
                </div>
                <MapPin className="size-5 text-[#dd1818] shrink-0 ml-2" />
              </div>

              {/* City Suggestions Menu */}
              {showFromSuggestions && (
                <div className="absolute top-[68px] left-0 w-full bg-white border border-gray-300 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[260px] overflow-y-auto animate-fade-in">
                  <div className="p-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Popular Boarding Cities
                  </div>
                  {POPULAR_CITIES.filter((c) =>
                    c.name.toLowerCase().includes(from.toLowerCase())
                  ).map((city) => (
                    <div
                      key={city.name}
                      onClick={() => {
                        setFrom(city.name);
                        setShowFromSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-red-50 hover:text-[#dd1818] cursor-pointer transition-colors border-b border-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-sm text-black block">{city.name}</span>
                        <span className="text-[11px] text-gray-500">{city.desc}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">Select</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From and To locations"
              className="size-10 lg:size-11 rounded-full bg-[#dd1818] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer my-1 lg:my-0"
            >
              <ArrowRightLeft className="size-4 lg:size-5" />
            </button>

            {/* Destination Point */}
            <div ref={toRef} className="relative w-full lg:flex-[1.2] min-w-0">
              <div
                onClick={() => setShowToSuggestions(true)}
                className="w-full h-[62px] border border-black rounded-[12px] flex items-center px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#dd1818] cursor-text"
              >
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Destination Point
                  </label>
                  <input
                    type="text"
                    value={to}
                    onFocus={() => setShowToSuggestions(true)}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setShowToSuggestions(true);
                    }}
                    placeholder="e.g. Bangalore"
                    className="w-full text-base sm:text-[18px] font-bold text-black focus:outline-none placeholder:text-[#a39f9f] bg-transparent truncate"
                  />
                </div>
                <MapPin className="size-5 text-[#dd1818] shrink-0 ml-2" />
              </div>

              {/* City Suggestions Menu */}
              {showToSuggestions && (
                <div className="absolute top-[68px] left-0 w-full bg-white border border-gray-300 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[260px] overflow-y-auto animate-fade-in">
                  <div className="p-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Popular Destination Cities
                  </div>
                  {POPULAR_CITIES.filter((c) =>
                    c.name.toLowerCase().includes(to.toLowerCase())
                  ).map((city) => (
                    <div
                      key={city.name}
                      onClick={() => {
                        setTo(city.name);
                        setShowToSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-red-50 hover:text-[#dd1818] cursor-pointer transition-colors border-b border-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-sm text-black block">{city.name}</span>
                        <span className="text-[11px] text-gray-500">{city.desc}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">Select</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Date - Clean, single calendar icon, no duplicate native icon */}
            <div className="relative w-full lg:flex-[1.1] min-w-0">
              <div
                onClick={() => {
                  try {
                    dateInputRef.current?.showPicker();
                  } catch {
                    dateInputRef.current?.focus();
                  }
                }}
                className="w-full h-[62px] border border-black rounded-[12px] flex items-center px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#dd1818] cursor-pointer relative"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between pr-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Travel Date
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateOffset(0);
                        }}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-red-50 hover:text-[#dd1818] px-1.5 py-0.5 rounded transition-colors"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateOffset(1);
                        }}
                        className="text-[10px] font-bold bg-gray-100 hover:bg-red-50 hover:text-[#dd1818] px-1.5 py-0.5 rounded transition-colors"
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                  <div className="text-base sm:text-[18px] font-bold text-black truncate select-none">
                    {formattedDate}
                  </div>
                  {/* Real date input underneath - completely invisible duplicate indicator */}
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  />
                </div>
                <Calendar className="size-5 text-gray-700 shrink-0 ml-2 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full lg:w-[150px] xl:w-[165px] h-[62px] bg-[#dd1818] hover:bg-[#b81212] active:scale-95 border-2 border-black rounded-[12px] text-white font-bold text-lg sm:text-[22px] flex items-center justify-center gap-2.5 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Search className="size-5" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
