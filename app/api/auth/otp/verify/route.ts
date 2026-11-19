import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, otp } = body;

    const cleanNumber = (mobile || "").replace(/\D/g, "");
    const last10Digits = cleanNumber.slice(-10);

    const record = global.otpStore?.get(last10Digits);

    if (!record) {
      return NextResponse.json(
        { success: false, message: "No OTP was requested for this number or it has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      global.otpStore.delete(last10Digits);
      return NextResponse.json(
        { success: false, message: "This OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP matching (or '123456' as universal test bypass)
    if (record.otp !== otp && otp !== "123456") {
      return NextResponse.json(
        { success: false, message: "Invalid OTP code. Please check and try again." },
        { status: 400 }
      );
    }

    // OTP is valid - clear it and return user profile
    global.otpStore.delete(last10Digits);

    return NextResponse.json({
      success: true,
      message: "Phone verified successfully!",
      user: {
        mobile: `+91 ${last10Digits}`,
        name: "Traveler",
        isLoggedIn: true,
      },
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
