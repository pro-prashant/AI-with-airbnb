// File: app/api/auth/signup/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/Model/UserAuth";
import ConnectionDb from "@/lib/Db";

const isProd = process.env.NODE_ENV === "production"; // ✅ NODE_ENV is built-in
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
};

export async function POST(req) {
  try {
    await ConnectionDb(); // ✅ ensure DB is connected

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ msg: "Missing Details" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ msg: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ success: true, user: newUser });
    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { msg: "Signup Error", success: false },
      { status: 500 }
    );
  }
}
