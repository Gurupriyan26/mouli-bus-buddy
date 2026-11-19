import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { pnr: string } }
) {
  const { pnr } = params;

  if (!pnr) {
    return NextResponse.json({ success: false, message: "PNR is required" }, { status: 400 });
  }

  const booking = global.bookingStore?.get(pnr);

  if (!booking) {
    // Return sample confirmed booking for demo if not in memory
    return NextResponse.json({
      success: true,
      booking: {
        pnr,
        bus: {
          id: "bus-1",
          name: "Thangavelu Travels (Bus Buddy)",
          busNumber: "TN 38 BB 1024",
          type: "A/C Seater / Sleeper (2+1)",
          from: "Chennai",
          to: "Bangalore",
          departureTime: "23:15",
          arrivalTime: "05:45",
          duration: "06h 35m",
          price: 1800,
          rating: 4.9,
          amenities: { wifi: true, charging: true, tracking: true, snacks: true },
          totalSeats: 36,
          availableSeatsCount: 14,
        },
        travelDate: "2026-11-25",
        passengers: [
          { name: "Gurupriyan", age: 24, gender: "Male", seatNumber: "U1" },
        ],
        selectedSeats: ["U1"],
        baseFare: 1800,
        gst: 90,
        totalFare: 1890,
        paymentMethod: "UPI",
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
      },
    });
  }

  return NextResponse.json({ success: true, booking });
}
