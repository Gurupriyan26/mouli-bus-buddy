import { NextResponse } from "next/server";

// In-memory OTP storage for demo/session resilience
declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number }>;
}

if (!global.otpStore) {
  global.otpStore = new Map();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile } = body;

    // Clean and validate mobile number
    const cleanNumber = (mobile || "").replace(/\D/g, "");

    if (!cleanNumber || cleanNumber.length < 10) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const last10Digits = cleanNumber.slice(-10);

    // Generate real 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    global.otpStore.set(last10Digits, { otp: generatedOtp, expiresAt });

    console.log(`\n========================================`);
    console.log(`[BUS BUDDY OTP] Generated for +91 ${last10Digits}: ${generatedOtp}`);
    console.log(`========================================\n`);

    return NextResponse.json({
      success: true,
      message: `OTP generated successfully for +91 ${last10Digits}`,
      otp: generatedOtp, // Included so frontend displays it in on-screen notification
      mobile: last10Digits,
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate OTP. Please try again." },
      { status: 500 }
    );
  }
}
