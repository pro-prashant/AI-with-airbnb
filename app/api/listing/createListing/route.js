
import ListingModel from "@/Model/ListingModel";
import User from "@/Model/UserAuth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import ConnectionDb from "@/lib/Db";

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload buffer to Cloudinary
function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);



  });
}

// ✅ Main Route Handler
export async function POST(req) {
                  await ConnectionDb();
  try {
    // ✅ Get token from cookies directly inside the route
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, msg: "Token not found" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hostId = decoded.id || decoded._id;
    console.log("check hostId",hostId);

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const landMark = formData.get("landMark");
    const categorey = formData.get("categorey");
    const location = formData.get("location"); // ✅ Added here

    const image1 = formData.get("image1");
    const image2 = formData.get("image2");
    const image3 = formData.get("image3");
               console.log("location Check", location);
    // ✅ Validation
    if (!title || !description || !price || !landMark || !categorey || !location || !image1 || !image2 || !image3) {
      return NextResponse.json({ success: false, msg: "Missing required fields" }, { status: 400 });
    }

    const buffer1 = Buffer.from(await image1.arrayBuffer());
    const buffer2 = Buffer.from(await image2.arrayBuffer());
    const buffer3 = Buffer.from(await image3.arrayBuffer());

    const uploaded1 = await uploadToCloudinary(buffer1, "listings");
    const uploaded2 = await uploadToCloudinary(buffer2, "listings");
    const uploaded3 = await uploadToCloudinary(buffer3, "listings");

    const listing = await ListingModel.create({
      title,
      description,
      price,
      landMark,
      categorey,
      location, // ✅ Stored here
      image1: uploaded1.secure_url,
      image2: uploaded2.secure_url,
      image3: uploaded3.secure_url,
      hostId,
    });

    await User.findByIdAndUpdate(hostId, { $push: { listing: listing._id } }, { new: true });
         console.log("check all fields",listing);
    return NextResponse.json({ success: true, msg: "Listing created successfully", listing }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
