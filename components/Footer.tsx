"use client";

import React from "react";
import { Youtube, Facebook, Instagram, Twitter, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1c1c1c] text-white pt-16 pb-12 border-t-4 border-[#dd1818]">
      <div className="max-w-[1512px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#dd1818] font-black text-[36px] tracking-tight font-serif">
                Bus Buddy
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Book online bus tickets for over 500+ top routes across Tamil Nadu, Karnataka, and Kerala with instant seat confirmation and guaranteed low fares.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#x"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="#youtube"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Youtube className="size-5" />
              </a>
              <a
                href="#facebook"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="#instagram"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Instagram className="size-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 uppercase tracking-wider font-serif">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  About Us & Services
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Reserve Your Ticket
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQs)
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  Help & Support Center (24/7)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Routes */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 uppercase tracking-wider font-serif">
              Popular Routes
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Chennai - Bangalore Express
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Madurai - Chennai Superfast
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Coimbatore - Karaikudi AC Sleeper
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Coimbatore - Nagarkovil Luxury
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Chennai - Hyderabad Multi-Axle
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Payment Security */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 uppercase tracking-wider font-serif">
              Secure Payments
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              All transactions are secured with 256-bit SSL encryption. We accept UPI (Google Pay, PhonePe), Credit/Debit Cards, Net Banking, and Wallets.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-mono">
              <span className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">UPI</span>
              <span className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">Visa / Master</span>
              <span className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">RuPay</span>
              <span className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">NetBanking</span>
            </div>
            <div className="mt-6 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="size-4" />
              <span>PCI-DSS Certified Gateway</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Bus Buddy (Thangavelu Travels). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </a>
            <a href="#contact" className="hover:text-gray-300 transition-colors">
              Contact: +91 63695 45115
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
