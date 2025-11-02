import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/Model/UserAuth";
import ConnectionDb from "@/lib/Db";

export async function GET() {
  try {
    await ConnectionDb(); // ✅ DB connection

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    console.log("Token from cookie:", token); // 🐞 debug 1

    if (!token) {
      return NextResponse.json({ msg: "Token not provided", user: null }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // 🐞 debug 2
    } catch (err) {
      console.error("JWT error:", err.message); // 🐞 debug 3
      return NextResponse.json({ msg: "Invalid token", user: null }, { status: 401 });
    }

    const userId = decoded.id || decoded._id;
    console.log("User ID:", userId); // 🐞 debug 4

    const user = await User.findById(userId).select("-password").populate(
        "listing",
        "title description landMark location price image1 image2 image3 categorey"
      );
    console.log("User from DB:", user); // 🐞 debug 5

    if (!user) {
      return NextResponse.json({ msg: "User not found", user: null }, { status: 404 });
    }

    return NextResponse.json({ msg: "User found", user, success: true });

  } catch (error) {
    console.error("Unexpected error:", error.message); // 🐞 debug 6
    return NextResponse.json({ msg: "Something went wrong", user: null }, { status: 500 });
  }
}
