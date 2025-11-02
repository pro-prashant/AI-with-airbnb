
import mongoose from "mongoose";

const BookSchema  = new mongoose.Schema({

    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    guest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    listing:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing",
        required:true,
    },
    
    status:{
        type:String,
        enum:["booked","cancel"],
        default:"booked",
    },
    CheckIn:{
        type:Date,
        required:true,
    },
    CheckOut:{
        type:Date,
        required:true,
    },
    TotalRent:{
        type:Number,
        required:true,
    }

},{timestamps:true})

const BookModel = mongoose.models.Booking || mongoose.model("Booking",BookSchema);
export default  BookModel;