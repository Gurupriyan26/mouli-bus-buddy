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
    bookedCount: 1840,
    isRecommended: true,
    popularityBadge: "🔥 #1 Most Booked",
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 14,
  },
  {
    id: "bus-4",
    name: "Thangavelu Night Rider Express",
    busNumber: "TN 01 BB 9901",
    type: "Multi-Axle Scania Semi-Sleeper",
    from: "Chennai",
    to: "Bangalore",
    departureTime: "21:30",
    arrivalTime: "04:30",
    duration: "07h 00m",
    price: 1450,
    rating: 4.8,
    bookedCount: 1520,
    isRecommended: true,
    popularityBadge: "⚡ High Demand",
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 40,
    availableSeatsCount: 8,
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
    rating: 4.6,
    bookedCount: 1290,
    isRecommended: true,
    popularityBadge: "👑 Top Recommended",
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
    rating: 4.4,
    bookedCount: 980,
    isRecommended: false,
    popularityBadge: "⭐ Popular Choice",
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 11,
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
    bookedCount: 1150,
    isRecommended: true,
    popularityBadge: "🔥 Most Booked",
    amenities: { wifi: true, charging: true, tracking: true, snacks: false },
    totalSeats: 36,
    availableSeatsCount: 22,
  },
  {
    id: "bus-6",
    name: "Thangavelu Premier Sleeper",
    busNumber: "TN 38 BB 7788",
    type: "A/C Sleeper (2+1)",
    from: "Chennai",
    to: "Bangalore",
    departureTime: "22:30",
    arrivalTime: "05:00",
    duration: "06h 30m",
    price: 1650,
    rating: 4.7,
    bookedCount: 1340,
    isRecommended: true,
    popularityBadge: "Top Pick",
    amenities: { wifi: true, charging: true, tracking: true, snacks: true },
    totalSeats: 36,
    availableSeatsCount: 6,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from")?.trim().toLowerCase();
  const to = searchParams.get("to")?.trim().toLowerCase();

  let filtered = [...MOCK_BUSES];

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

  // Ensure Most Booked & Recommended buses come first
  filtered.sort((a, b) => (b.bookedCount || 0) - (a.bookedCount || 0));

  return NextResponse.json({ success: true, buses: filtered });
}
