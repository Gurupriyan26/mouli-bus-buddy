import { NextResponse } from "next/server";
import { Booking } from "@/types";

declare global {
  var bookingStore: Map<string, Booking>;
}

if (!global.bookingStore) {
  global.bookingStore = new Map();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bus, travelDate, passengers, selectedSeats, paymentMethod } = body;

    if (!bus || !selectedSeats || selectedSeats.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing booking details or no seats selected." },
        { status: 400 }
      );
    }

    // Generate unique PNR
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const pnr = `BB-${randomNum}`;

    const seatPrice = bus.price || 1800;
    const baseFare = seatPrice * selectedSeats.length;
    const gst = Math.round(baseFare * 0.05);
    const totalFare = baseFare + gst;

    const newBooking: Booking = {
      pnr,
      bus,
      travelDate: travelDate || new Date().toISOString().split("T")[0],
      passengers: passengers || [],
      selectedSeats,
      baseFare,
      gst,
      totalFare,
      paymentMethod: paymentMethod || "UPI",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    global.bookingStore.set(pnr, newBooking);

    console.log(`\n========================================`);
    console.log(`[BOOKING CONFIRMED] PNR: ${pnr} | Seats: ${selectedSeats.join(", ")} | Total: ₹${totalFare}`);
    console.log(`========================================\n`);

    return NextResponse.json({
      success: true,
      message: "Ticket booked successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to confirm booking." },
      { status: 500 }
    );
  }
}
