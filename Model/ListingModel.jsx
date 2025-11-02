
import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  price: { type: String, required: true },
  landMark: { type: String, required: true },
  location: { type: String, required: true },
  categorey: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
}, { timestamps: true });

const ListingModel = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
export default ListingModel;
