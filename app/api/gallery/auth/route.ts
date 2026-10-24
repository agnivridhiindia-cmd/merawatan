import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const normalizedEmail = (email || "").trim().toLowerCase();
    const authorizedEmail = "raghuwanshiashok34@gmail.com".toLowerCase();
    const authorizedPassword = "Ashok@1234";

    if (normalizedEmail === authorizedEmail && password === authorizedPassword) {
      // Issue session token for upload authorization
      const sessionToken = Buffer.from(`${normalizedEmail}:${Date.now()}:AUTHORIZED_ASHOK`).toString("base64");
      return NextResponse.json({
        success: true,
        message: "Authorized as DFR Ashok Raghuvanshi (Executive Admin)",
        token: sessionToken,
        user: {
          name: "DFR Ashok Raghuvanshi (Retd.)",
          email: "Raghuwanshiashok34@gmail.com",
          role: "President & Founder, Mera Watan Welfare Foundation",
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Access Denied: Invalid credentials. Only authorized NGO executives may upload ground photos.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Gallery auth check error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service error. Please try again." },
      { status: 500 }
    );
  }
}
