export interface User {
  mobile: string;
  name?: string;
  email?: string;
  isLoggedIn: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Bus {
  id: string;
  name: string;
  busNumber: string;
  type: string; // e.g. "A/C Seater / Sleeper (2+1)"
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  bookedCount?: number; // e.g. 1420
  isRecommended?: boolean;
  popularityBadge?: string; // e.g. "Most Booked", "Top Rated"
  amenities: {
    wifi: boolean;
    charging: boolean;
    tracking: boolean;
    snacks: boolean;
  };
  totalSeats: number;
  availableSeatsCount: number;
}

export interface Seat {
  id: string;
  number: string;
  deck: "lower" | "upper";
  type: "seater" | "sleeper";
  price: number;
  isBooked: boolean;
  isLadies?: boolean;
}

export interface Passenger {
  name: string;
  age: number | string;
  gender: "Male" | "Female" | "Other";
  seatNumber: string;
}

export interface Booking {
  pnr: string;
  bus: Bus;
  travelDate: string;
  passengers: Passenger[];
  selectedSeats: string[];
  baseFare: number;
  gst: number;
  totalFare: number;
  paymentMethod: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  createdAt: string;
}
