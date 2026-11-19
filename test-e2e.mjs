async function runE2ETest() {
  console.log("==================================================");
  console.log("🚀 STARTING E2E AUTOMATED TEST FOR BUS BUDDY");
  console.log("Testing Target: http://localhost:3000");
  console.log("Phone Number: 9344187782");
  console.log("==================================================\n");

  const baseUrl = "http://localhost:3000";

  // Test 1: Homepage Availability
  console.log("👉 [1/6] Checking Homepage (http://localhost:3000)...");
  try {
    const homeRes = await fetch(baseUrl);
    const homeHtml = await homeRes.text();
    if (homeRes.status === 200 && homeHtml.includes("Bus Buddy")) {
      console.log("   ✅ Homepage loaded successfully (Status: 200, Brand: 'Bus Buddy' verified)\n");
    } else {
      console.error("   ❌ Homepage check failed. Status:", homeRes.status);
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ Cannot connect to http://localhost:3000. Is server running?", err.message);
    process.exit(1);
  }

  // Test 2: OTP Generation API for 9344187782
  console.log("👉 [2/6] Testing OTP Generation for Mobile: 9344187782...");
  let generatedOtp = null;
  try {
    const otpRes = await fetch(`${baseUrl}/api/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: "9344187782" }),
    });

    const otpData = await otpRes.json();
    console.log("   API Response:", otpData);

    if (otpRes.status === 200 && otpData.success) {
      console.log("   ✅ OTP generation succeeded! Mobile: +91", otpData.mobile);
      // We can also verify with 123456 (built-in universal test OTP) or global store
    } else {
      console.error("   ❌ OTP send failed:", otpData);
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ Error during OTP send:", err.message);
    process.exit(1);
  }

  // Test 3: OTP Verification API
  console.log("\n👉 [3/6] Testing OTP Verification with code '123456'...");
  try {
    const verifyRes = await fetch(`${baseUrl}/api/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: "9344187782", otp: "123456" }),
    });

    const verifyData = await verifyRes.json();
    console.log("   API Response:", verifyData);

    if (verifyRes.status === 200 && verifyData.success) {
      console.log("   ✅ Login & Authentication succeeded! User verified:", verifyData.user);
    } else {
      console.error("   ❌ OTP verification failed:", verifyData);
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ Error during OTP verify:", err.message);
    process.exit(1);
  }

  // Test 4: Bus Search (Chennai -> Bangalore)
  console.log("\n👉 [4/6] Searching buses for route: Chennai -> Bangalore...");
  let selectedBus = null;
  try {
    const busRes = await fetch(`${baseUrl}/api/buses?from=Chennai&to=Bangalore`);
    const busData = await busRes.json();

    if (busRes.status === 200 && busData.buses && busData.buses.length > 0) {
      selectedBus = busData.buses[0];
      console.log(`   ✅ Found ${busData.buses.length} buses.`);
      console.log(`   Selected Bus: ${selectedBus.name} (${selectedBus.busNumber}) - ₹${selectedBus.price}`);
    } else {
      console.error("   ❌ Bus search failed or returned 0 results:", busData);
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ Error during bus search:", err.message);
    process.exit(1);
  }

  // Test 5: Booking Creation & PNR Generation
  console.log("\n👉 [5/6] Creating booking (Seat U1, Passenger: Gurupriyan, Mode: UPI)...");
  let confirmedPnr = null;
  try {
    const bookingRes = await fetch(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bus: selectedBus,
        travelDate: "2026-11-25",
        passengers: [
          { name: "Gurupriyan", age: 24, gender: "Male", seatNumber: "U1" },
        ],
        selectedSeats: ["U1"],
        paymentMethod: "UPI",
      }),
    });

    const bookingData = await bookingRes.json();
    console.log("   API Response:", bookingData);

    if (bookingRes.status === 200 && bookingData.success && bookingData.booking) {
      confirmedPnr = bookingData.booking.pnr;
      console.log("   ✅ Booking Confirmed!");
      console.log(`   🎟️ Generated PNR: ${confirmedPnr}`);
      console.log(`   💰 Base Fare: ₹${bookingData.booking.baseFare} | GST: ₹${bookingData.booking.gst} | Total: ₹${bookingData.booking.totalFare}`);
    } else {
      console.error("   ❌ Booking failed:", bookingData);
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ Error during booking:", err.message);
    process.exit(1);
  }

  // Test 6: Final Boarding Pass Retrieval by PNR
  console.log(`\n👉 [6/6] Verifying Final Ticket / Boarding Pass for PNR: ${confirmedPnr}...`);
  try {
    const ticketRes = await fetch(`${baseUrl}/api/tickets/${confirmedPnr}`);
    const ticketData = await ticketRes.json();

    if (ticketRes.status === 200 && ticketData.success && ticketData.booking) {
      console.log("   ✅ Boarding Pass retrieved successfully!");
      console.log(`   Route: ${ticketData.booking.bus.from} ➔ ${ticketData.booking.bus.to}`);
      console.log(`   Departure: ${ticketData.booking.bus.departureTime} | Arrival: ${ticketData.booking.bus.arrivalTime}`);
      console.log(`   Seat: ${ticketData.booking.selectedSeats.join(", ")} | Status: ${ticketData.booking.status}`);
    } else {
      console.error("   ❌ Ticket retrieval failed:", ticketData);
      process.exit(1);
    }
  } catch (err) {
    console.error("   ❌ Error during ticket retrieval:", err.message);
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("🎉 ALL 6/6 END-TO-END TESTS PASSED WITH 100% SUCCESS!");
  console.log("==================================================");
}

runE2ETest();
