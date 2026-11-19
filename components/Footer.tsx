"use client";

import React from "react";
import { Youtube, Facebook, Instagram, Twitter, Phone, Mail, MapPin, Bus } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1c1c1c] text-white pt-14 pb-10 border-t-4 border-[#dd1818]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-9 rounded-xl bg-[#dd1818] flex items-center justify-center text-white">
                <Bus className="size-5" />
              </div>
              <span className="text-[#dd1818] font-black text-3xl tracking-tight font-serif">
                Bus Buddy
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Official bus booking portal for Thangavelu Travels and 500+ premium bus routes across Tamil Nadu, Karnataka, and Kerala with instant seat confirmation.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#x"
                aria-label="Twitter"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Youtube className="size-4" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="size-10 rounded-xl bg-gray-800 hover:bg-[#dd1818] flex items-center justify-center transition-colors text-white"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
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
                <a href="#hero" className="hover:text-white transition-colors">
                  Check Bus Schedule
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Routes */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider font-serif">
              Popular Routes
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Chennai → Bangalore Express
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Coimbatore → Nagarkovil
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Coimbatore → Karaikudi Premium
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  Madurai → Chennai Superfast
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpline */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider font-serif">
              Customer Support
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-[#dd1818] shrink-0" />
                <a href="tel:6369545115" className="hover:text-white transition-colors font-mono font-bold">
                  +91 63695 45115
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-[#dd1818] shrink-0" />
                <a href="mailto:support@thangavelutravels.com" className="hover:text-white transition-colors">
                  support@thangavelutravels.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-[#dd1818] shrink-0 mt-1" />
                <span>Omni Bus Stand, Gandhipuram, Coimbatore, Tamil Nadu - 641012</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Bus Buddy (Thangavelu Travels). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-gray-300">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-gray-300">Terms of Service</a>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">100% Safe Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
