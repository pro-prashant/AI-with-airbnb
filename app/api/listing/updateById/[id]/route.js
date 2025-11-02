import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import ListingModel from "@/Model/ListingModel";
import ConnectionDb from "@/lib/Db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req, { params }) {
  await ConnectionDb();

  try {
    const id = params.id;
    const formData = await req.formData();

    // Parse text fields
    const updatedData = {
      title: formData.get("title") || "",
      description: formData.get("description") || "",
      price: formData.get("price") || "",
      location: formData.get("location") || "",
      landMark: formData.get("landMark") || "",
    };

    // Upload helper
    const uploadToCloudinary = async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "listings" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
      return result.secure_url;
    };

    // Images
    const image1 = formData.get("backendImage1");
    const image2 = formData.get("backendImage2");
    const image3 = formData.get("backendImage3");

    if (image1 && typeof image1 === "object") {
      updatedData.image1 = await uploadToCloudinary(image1);
    }
    if (image2 && typeof image2 === "object") {
      updatedData.image2 = await uploadToCloudinary(image2);
    }
    if (image3 && typeof image3 === "object") {
      updatedData.image3 = await uploadToCloudinary(image3);
    }

    const updatedListing = await ListingModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedListing) {
      return NextResponse.json({ msg: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Update successful", data: updatedListing });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ msg: "Error", error: error.message }, { status: 500 });
  }
}
