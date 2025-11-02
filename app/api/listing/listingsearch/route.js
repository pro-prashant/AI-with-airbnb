
import ListingModel from "@/Model/ListingModel";
import { NextResponse } from "next/server";
import ConnectionDb from "@/lib/Db";

export async function GET(req) {
  try {
    await ConnectionDb();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 400 });
    }

    const listing = await ListingModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { landMark: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Listing not found", error }, { status: 500 });
  }
}
