import ConnectionDb from "@/lib/Db";
import ListingModel from "@/Model/ListingModel";
import { NextResponse } from "next/server";





export async function POST(req,{params}){

    try{ 
                 ConnectionDb();
                const {id} = params;
                const {rating} = req.json();
                const listing = await ListingModel.findById(id);
                      listing.rating = Number(rating);
                      await listing.save();
                      return  NextResponse.json({msg:listing});
    }catch(error){
        return NextResponse.json({msg:error});
    }
}
