
import ConnectionDb from "@/lib/Db";
import ListingModel from "@/Model/ListingModel";
import User from "@/Model/UserAuth";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await ConnectionDb();
    const { id } = params;

    const listing = await ListingModel.findByIdAndUpdate(id, {
      isBooked: false,
    });

    if (!listing) {
      return NextResponse.json({ msg: "Listing not found" });
    }

    const user = await User.findByIdAndUpdate(listing.guest, {
      $pull: { booking: listing._id },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" });
    }

    return NextResponse.json({ msg: "Booking successfully cancelled" });
  } catch (error) {
    return NextResponse.json({ msg: "Error", error: error.message });
  }
}
