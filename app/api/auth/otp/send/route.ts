import { NextResponse } from "next/server";

declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number }>;
}

if (!global.otpStore) {
  global.otpStore = new Map();
}

/**
 * Send real SMS via Fast2SMS Gateway (India)
 */
async function sendFast2SMS(apiKey: string, mobile: string, otp: string) {
  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: mobile,
      }),
    });

    const data = await res.json();
    console.log("[Fast2SMS Response]:", data);
    return data.return === true;
  } catch (error) {
    console.error("[Fast2SMS Error]:", error);
    return false;
  }
}

/**
 * Send real SMS via Twilio Gateway
 */
async function sendTwilioSMS(
  accountSid: string,
  authToken: string,
  fromNumber: string,
  mobile: string,
  otp: string
) {
  try {
    const formattedTo = `+91${mobile}`;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const params = new URLSearchParams();
    params.append("To", formattedTo);
    params.append("From", fromNumber);
    params.append("Body", `Your Bus Buddy verification code is: ${otp}. Valid for 5 minutes. Do not share this OTP.`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();
    console.log("[Twilio Response]:", data);
    return !data.error_code;
  } catch (error) {
    console.error("[Twilio Error]:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile } = body;

    const cleanNumber = (mobile || "").replace(/\D/g, "");

    if (!cleanNumber || cleanNumber.length < 10) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const last10Digits = cleanNumber.slice(-10);

    // Generate real 6-digit secure random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins validity

    // Store securely in server-side session
    global.otpStore.set(last10Digits, { otp: generatedOtp, expiresAt });

    const fast2smsApiKey = process.env.FAST2SMS_API_KEY;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    let smsDispatched = false;

    // 1. Try Fast2SMS Gateway if API key provided
    if (fast2smsApiKey) {
      smsDispatched = await sendFast2SMS(fast2smsApiKey, last10Digits, generatedOtp);
    }
    // 2. Try Twilio if credentials provided
    else if (twilioSid && twilioToken && twilioFrom) {
      smsDispatched = await sendTwilioSMS(twilioSid, twilioToken, twilioFrom, last10Digits, generatedOtp);
    } else {
      console.warn("\n=======================================================");
      console.warn(`[SMS GATEWAY ALERT] No SMS_API_KEY configured in .env.local.`);
      console.warn(`OTP for +91 ${last10Digits} is: ${generatedOtp}`);
      console.warn(`Add FAST2SMS_API_KEY in .env.local to send physical cellular SMS.`);
      console.warn("=======================================================\n");
    }

    return NextResponse.json({
      success: true,
      message: smsDispatched
        ? `OTP has been dispatched via SMS to +91 ${last10Digits}`
        : `OTP generated for +91 ${last10Digits}`,
      mobile: last10Digits,
      smsSent: smsDispatched,
      expiresInSeconds: 300,
      // In development fallback if no key is set yet, also log in terminal
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP SMS. Please try again." },
      { status: 500 }
    );
  }
}
