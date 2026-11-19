"use client";

import React, { useState } from "react";
import { MapPin, Calendar, ArrowRightLeft, Search } from "lucide-react";

interface HeroSearchProps {
  onSearch: (from: string, to: string, date: string) => void;
}

export default function HeroSearch({ onSearch }: HeroSearchProps) {
  const [from, setFrom] = useState("Chennai");
  const [to, setTo] = useState("Bangalore");
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from, to, date);
  };

  return (
    <section id="hero" className="relative w-full pt-12 pb-20 overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-white">
      <div className="max-w-[1512px] mx-auto px-6 flex flex-col items-center">
        {/* Subtitle - Exact Figma font & style */}
        <p className="text-[28px] md:text-[32px] font-normal text-black/70 mb-2 font-sans tracking-wide">
          Get your bus tickets
        </p>

        {/* Main Title - Exact Figma font (Aclonica) & style */}
        <h1 className="text-[44px] md:text-[76px] lg:text-[85px] font-bold text-black text-center mb-14 tracking-tight leading-none font-serif">
          Find Best Bus For You !
        </h1>

        {/* Bus Search Box Card - Matching Figma exact Dimensions & Shadow */}
        <div className="w-full max-w-[1327px] bg-white border border-[#a39f9f] rounded-[28px] shadow-[10px_15px_5px_0px_#a39f9f] p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-5 justify-between">
            {/* Starting Point - Figma 1:16 */}
            <div className="relative w-full lg:w-[345px] h-[60px] border border-black rounded-[12px] flex items-center px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#dd1818]">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Starting Point
                </label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. Chennai"
                  className="w-full text-[19px] font-bold text-black focus:outline-none placeholder:text-[#a39f9f]"
                />
              </div>
              <MapPin className="size-6 text-[#dd1818] shrink-0" />
            </div>

            {/* Swap Button - Figma 1:13334 */}
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From and To locations"
              className="size-11 rounded-full bg-[#dd1818] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <ArrowRightLeft className="size-5" />
            </button>

            {/* Destination Point - Figma 1:23 */}
            <div className="relative w-full lg:w-[345px] h-[60px] border border-black rounded-[12px] flex items-center px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#dd1818]">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Destination Point
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full text-[19px] font-bold text-black focus:outline-none placeholder:text-[#a39f9f]"
                />
              </div>
              <MapPin className="size-6 text-[#dd1818] shrink-0" />
            </div>

            {/* Travel Date - Figma 1:30 */}
            <div className="relative w-full lg:w-[325px] h-[60px] border border-black rounded-[12px] flex items-center px-4 bg-white transition-all focus-within:ring-2 focus-within:ring-[#dd1818]">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-[17px] font-bold text-black focus:outline-none bg-transparent"
                />
              </div>
              <Calendar className="size-6 text-gray-700 shrink-0 pointer-events-none" />
            </div>

            {/* Search Button - Figma 1:145 */}
            <button
              type="submit"
              className="w-full lg:w-[170px] h-[60px] bg-[#dd1818] hover:bg-[#b81212] active:scale-95 border-2 border-black rounded-[12px] text-white font-bold text-[24px] flex items-center justify-center gap-3 transition-all shadow-md shrink-0"
            >
              <Search className="size-6" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
