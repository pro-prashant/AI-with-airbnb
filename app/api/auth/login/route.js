
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/Model/UserAuth";
import ConnectionDb from "@/lib/Db";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: "/",
};

export async function POST(req) {
  try {
    await ConnectionDb(); // ✅ FIXED: connect to DB

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ msg: "Email and Password required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).populate(
        "listing",
        "title description landMark location price image1 image2 image3 categorey"
      );
    if (!user) {
      return NextResponse.json({ msg: "Invalid user" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ msg: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      msg: "Login Successful",
      success: true,
      user,
    });

    response.cookies.set("token", token, cookieOptions); // ✅ sets cookie

    return response;
  } catch (error) {
    console.log("Login Error:", error);
    return NextResponse.json(
      { msg: "Login failed", success: false },
      { status: 500 }
    );
  }
}
