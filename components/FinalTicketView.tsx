"use client";

import React, { useRef } from "react";
import { Download, Printer, CheckCircle, ArrowRight, Share2, Bus, QrCode } from "lucide-react";
import { Booking } from "@/types";

interface FinalTicketViewProps {
  booking: Booking;
  onBookAnother: () => void;
}

export default function FinalTicketView({
  booking,
  onBookAnother,
}: FinalTicketViewProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      if (ticketRef.current) {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
        pdf.save(`BusBuddy-Ticket-${booking.pnr}.pdf`);
      }
    } catch (err) {
      console.error("PDF generation error:", err);
      window.print();
    }
  };

  return (
    <div className="w-full py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-[1100px] mx-auto">
        {/* Success Header Notification */}
        <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-500 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-emerald-900 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle className="size-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">
                Booking Confirmed Successfully!
              </h2>
              <p className="text-xs text-emerald-700">
                PNR: <span className="font-mono font-bold text-sm">{booking.pnr}</span> • SMS & Email confirmation sent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="bg-[#dd1818] hover:bg-[#b81212] active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-2"
            >
              <Download className="size-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-white border-2 border-black hover:bg-gray-100 active:scale-95 text-black font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-2"
            >
              <Printer className="size-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Printable Ticket Area - Matching Exact Figma Boarding Pass (1:698) */}
        <div
          ref={ticketRef}
          className="bg-white border-2 border-[#323232] rounded-[36px] overflow-hidden shadow-2xl relative"
        >
          {/* Top Red Header - Boarding Pass (Figma 1:702) */}
          <div className="bg-[#dd1818] text-white px-8 py-5 flex items-center justify-between border-b border-[#323232]">
            <div className="flex items-center gap-3">
              <Bus className="size-8" />
              <h1 className="text-3xl md:text-4xl font-black font-serif tracking-tight">
                Boarding Pass
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider block opacity-90">
                PNR Number
              </span>
              <span className="font-mono font-black text-2xl tracking-widest">
                {booking.pnr}
              </span>
            </div>
          </div>

          {/* Ticket Body: Two column layout with perforated line */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left 8 columns: Journey Details */}
            <div className="md:col-span-8 space-y-6">
              {/* Route & Times */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">From</span>
                    <h3 className="text-2xl font-black text-black font-serif">{booking.bus.from}</h3>
                    <span className="text-sm font-bold text-[#dd1818] font-mono">{booking.bus.departureTime}</span>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <span className="text-xs font-semibold text-gray-500 mb-1">{booking.bus.duration}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-0.5 bg-gray-400" />
                      <div className="size-2 rounded-full bg-[#dd1818]" />
                      <div className="w-12 h-0.5 bg-gray-400" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">Direct Service</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-500 uppercase">To</span>
                    <h3 className="text-2xl font-black text-black font-serif">{booking.bus.to}</h3>
                    <span className="text-sm font-bold text-[#dd1818] font-mono">{booking.bus.arrivalTime}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 flex flex-wrap items-center justify-between text-xs text-gray-700 gap-2">
                  <span><strong>Travel Date:</strong> {booking.travelDate}</span>
                  <span><strong>Bus:</strong> {booking.bus.name} ({booking.bus.busNumber})</span>
                  <span><strong>Class:</strong> {booking.bus.type}</span>
                  <span className="text-[#dd1818] font-bold"><strong>Registered Mobile:</strong> +91 9344187782</span>
                </div>
              </div>

              {/* Passengers Table */}
              <div>
                <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Passenger Information
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs font-bold text-gray-600 uppercase">
                      <tr>
                        <th className="py-2.5 px-4">Passenger Name</th>
                        <th className="py-2.5 px-4">Age / Gender</th>
                        <th className="py-2.5 px-4 text-center">Seat No.</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {booking.passengers.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-black">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600">{p.age} Yrs / {p.gender}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-[#dd1818] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                              {p.seatNumber}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                            Confirmed
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="flex justify-between items-center text-xs text-gray-600 border-t border-gray-200 pt-4">
                <div>
                  <span>Base Fare: ₹{booking.baseFare}</span> • <span>GST (5%): ₹{booking.gst}</span> • <span>Paid via: {booking.paymentMethod}</span>
                </div>
                <div className="text-lg font-black text-black font-mono">
                  Total Paid: <span className="text-[#dd1818]">₹ {booking.totalFare}</span>
                </div>
              </div>
            </div>

            {/* Right 4 columns: Barcode & Verification Stub (Figma 1:701) */}
            <div className="md:col-span-4 border-t md:border-t-0 md:border-l-2 md:border-dashed md:border-gray-300 md:pl-8 flex flex-col items-center justify-between text-center">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                  Official Verification QR
                </span>
                <div className="size-36 p-2 border-2 border-black rounded-2xl bg-white shadow-inner flex items-center justify-center mx-auto mb-3">
                  <QrCode className="size-28 text-black" />
                </div>
                <span className="text-[11px] font-mono text-gray-500 block">
                  Scan to verify with conductor
                </span>
              </div>

              {/* Simulated Barcode matching Figma 1:4 */}
              <div className="w-full my-6 flex flex-col items-center">
                <div className="h-14 w-full max-w-[220px] flex items-stretch justify-center gap-0.5 bg-white p-1">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1].map((w, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{ width: `${w * 2.5}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs tracking-widest text-black font-bold mt-1">
                  *{booking.pnr}*
                </span>
              </div>

              <div className="text-xs text-gray-500">
                <span className="block font-bold text-black mb-0.5">Boarding Point:</span>
                <span>Main Central Bus Stand, Bay 4</span>
              </div>
            </div>
          </div>

          {/* Bottom Red Footer Banner matching Figma 1:704 */}
          <div className="bg-[#dd1818] text-white px-8 py-4 flex flex-col md:flex-row items-center justify-between text-xs font-medium border-t border-[#323232] gap-2">
            <p className="text-center md:text-left">
              Note : This Boarding pass will be send to your Register Mail and Mobile Number
            </p>
            <div className="flex items-center gap-2 font-mono font-bold text-sm">
              <span>Helpline :</span>
              <a href="tel:+916369545115" className="hover:underline">
                +91 63695 45115
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={onBookAnother}
            className="text-gray-700 hover:text-black font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:underline"
          >
            <span>← Book Another Bus Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
