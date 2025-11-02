
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  listing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
  booking: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
