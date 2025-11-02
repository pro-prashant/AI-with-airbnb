
import ConnectionDb from "@/lib/Db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ListingModel from "@/Model/ListingModel";
import BookModel from "@/Model/BookModel";
import User from "@/Model/UserAuth";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req, context) {
  try {
    await ConnectionDb();

    // ✅ Correct way to get cookies
    const cookieStore = await cookies();  // Await required here
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ msg: "Token not found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (error) {
      return NextResponse.json({ msg: "Invalid token", user: null });
    }

    const userId = decoded.id || decoded._id;

    // ✅ Correct way to use params
    const { id } = context.params;

    const { CheckIn, CheckOut, TotalRent } = await req.json();

    if (!CheckIn || !CheckOut || !TotalRent) {
      return NextResponse.json({ msg: "Missing required fields: CheckIn, CheckOut, TotalRent" });
    }

    const listing = await ListingModel.findById(id);
    if (!listing) {
      return NextResponse.json({ msg: "Listing not found" });
    }

    if (new Date(CheckIn) >= new Date(CheckOut)) {
      return NextResponse.json({ msg: "Invalid CheckIn or CheckOut dates" });
    }

    if (listing.isBooked) {
      return NextResponse.json({ msg: "Listing is already booked" });
    }

    const booking = await BookModel.create({
      CheckIn: new Date(CheckIn),
      CheckOut: new Date(CheckOut),
      TotalRent,
      host: listing.hostId,
      guest: userId,
      listing: listing._id,
    });

    const populatedBooking = await booking.populate("host guest listing");

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { booking: booking._id } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ msg: "User not found" });
    }

    listing.guest = userId;
    listing.isBooked = true;
    await listing.save();

    return NextResponse.json({ msg: "Booking created successfully", booking: populatedBooking });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ msg: "Something went wrong", error: error.message });
  }
}
