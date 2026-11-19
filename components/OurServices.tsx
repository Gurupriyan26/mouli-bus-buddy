"use client";

import React from "react";
import { ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export default function OurServices() {
  const services = [
    {
      id: "secure-payment",
      title: "Secure Payment",
      description: "Integrate secure payment gateways for user to pay for their tickets",
      icon: ShieldCheck,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "refund-policy",
      title: "Refund Policy",
      description: "Offer Options for the users to purchase refundable tickets with clear terms",
      icon: RefreshCw,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      id: "support",
      title: "24/7 Support",
      description: "Get assistance anytime through chat, mail, or phone",
      icon: Headphones,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <section id="services" className="w-full py-16 bg-white border-t border-gray-100">
      <div className="max-w-[1512px] mx-auto px-6">
        {/* Section Heading - Exact Figma 1:13322 */}
        <div className="text-center mb-12">
          <h2 className="text-[42px] md:text-[50px] font-bold text-black font-serif">
            Our <span className="text-[#dd1818]">Services</span>
          </h2>
        </div>

        {/* 3 Gray Service Cards - Exact Figma Dimensions (460x220) and #dfdfdf background */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="w-full max-w-[460px] h-[230px] bg-[#dfdfdf] rounded-[20px] p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group overflow-hidden border border-gray-300/40"
              >
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-4">
                  <div className={`size-14 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className={`size-8 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-[30px] md:text-[34px] font-bold text-black font-serif leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[17px] text-gray-800 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
