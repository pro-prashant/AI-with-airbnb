// app/api/listing/findById/[id]/route.js
import ConnectionDb from "@/lib/Db";
import ListingModel from "@/Model/ListingModel";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  try {
    await ConnectionDb() ; // only if needed

    const { id } = params;
    console.log("Received ID:", id); // ✅ useful log

    const findData = await ListingModel.findById(id);

    if (!findData) {
      return NextResponse.json({ msg: "Listing ID not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Listing found", data: findData }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ msg: "Error occurred", error: error.message }, { status: 500 });
  }
}  
