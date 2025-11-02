
import ListingModel from "@/Model/ListingModel";
import User from "@/Model/UserAuth";
import { NextResponse } from "next/server";
import ConnectionDb from "@/lib/Db";

export async function DELETE(req, { params }) {
  await ConnectionDb();

  try {
    const { id } = params;

    const listing = await ListingModel.findByIdAndDelete(id);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    const user = await User.findByIdAndUpdate( 
      listing.hostId,
      { $pull: { listing: listing._id } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Listing Deleted Successfully", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
