import { NextResponse } from "next/server";
import { Bus } from "@/types";

const MOCK_BUSES: Bus[] = [
  {
    id: "bus-1",
    name: "Thangavelu Travels (Bus Buddy Express)",
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
  {
    id: "bus-2",
    name: "Thangavelu Super Luxury",
    busNumber: "TN 37 TL 8821",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Coimbatore",
    to: "Nagarkovil",
    departureTime: "23:15",
    arrivalTime: "05:45",
    duration: "06h 35m",
    price: 1350,
    rating: 4.0,
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 19,
  },
  {
    id: "bus-3",
    name: "Thangavelu AC Sleeper Premium",
    busNumber: "TN 63 BB 4590",
    type: "A/C Seater / Sleeper (2+1)",
    from: "Coimbatore",
    to: "Karaikudi",
    departureTime: "23:15",
    arrivalTime: "05:45",
    duration: "07h 45m",
    price: 1700,
    rating: 4.2,
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 11,
  },
  {
    id: "bus-4",
    name: "Thangavelu Night Rider",
    busNumber: "TN 01 BB 9901",
    type: "Multi-Axle Scania Semi-Sleeper",
    from: "Chennai",
    to: "Hyderabad",
    departureTime: "21:30",
    arrivalTime: "06:00",
    duration: "08h 30m",
    price: 1600,
    rating: 4.8,
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 40,
    availableSeatsCount: 16,
  },
  {
    id: "bus-5",
    name: "Thangavelu Royal Travels",
    busNumber: "TN 59 BB 3341",
    type: "A/C Sleeper (2+1)",
    from: "Madurai",
    to: "Chennai",
    departureTime: "22:00",
    arrivalTime: "05:30",
    duration: "07h 30m",
    price: 1200,
    rating: 4.5,
    amenities: { wifi: true, charging: true, tracking: true, snacks: false },
    totalSeats: 36,
    availableSeatsCount: 22,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from")?.trim().toLowerCase();
  const to = searchParams.get("to")?.trim().toLowerCase();

  let filtered = MOCK_BUSES;

  if (from && to) {
    const matches = MOCK_BUSES.filter(
      (b) =>
        b.from.toLowerCase().includes(from) &&
        b.to.toLowerCase().includes(to)
    );
    if (matches.length > 0) {
      filtered = matches;
    }
  } else if (from) {
    const matches = MOCK_BUSES.filter((b) => b.from.toLowerCase().includes(from));
    if (matches.length > 0) filtered = matches;
  }

  return NextResponse.json({ success: true, buses: filtered });
}
