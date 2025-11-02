
import ConnectionDb from "@/lib/Db";
import ListingModel from "@/Model/ListingModel";
import { NextResponse } from "next/server";

export async function GET() {
              await ConnectionDb();
  try {
    const listing = await ListingModel.find();

    if (!listing || listing.length === 0) {
      return NextResponse.json({ msg: "Listing not found", success: false });
    }

    return NextResponse.json({
      msg: "Listing fetched successfully",
      success: true,
      listing, // sending data properly
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Server Error",
      success: false,
      error: error.message,
    });
  }
}
