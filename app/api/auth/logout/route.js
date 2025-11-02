
import ConnectionDb from "@/lib/Db";
import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

export async function POST(req) {
  await ConnectionDb();
  try {
    const response = new NextResponse(JSON.stringify({ msg: "Logout Successfully" }), {
      status: 200,
    });

    response.cookies.set("token", "", {
      ...cookieOptions,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ msg: "LogOut Error" }, { status: 500 });
  }
}
