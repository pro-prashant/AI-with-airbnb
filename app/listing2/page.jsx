
"use client";
import React, { useContext } from "react";
import { FaArrowLeftLong, FaTreeCity } from "react-icons/fa6";
import { MdOutlinePool, MdBedroomParent } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { BiBuildingHouse } from "react-icons/bi";
import { ListingContext } from "@/app/context/contextlisting";
import { useRouter } from "next/navigation";
import Chatbot from "../component/Chatbot";

const Listing2 = () => {
    const router = useRouter();
    const {categorey,setCategorey} = useContext(ListingContext);
    console.log(categorey);
    const handleListing3 = (e)=>{
        e.preventDefault();
      router.push("/listing3")
    }
    
  return (
    <>
      <div className="flex items-center justify-between py-6 px-4">
        <button onClick={()=>router.push("/listing")}>
          <FaArrowLeftLong className="text-white bg-red-600 w-10 h-10 rounded-full p-2 cursor-pointer" />
        </button>
        <h2 className="text-2xl font-semibold text-white bg-red-600 px-6 py-2 rounded-full">
          Setup Your Category
        </h2>
      </div>

      <h2 className="text-2xl text-center mt-4 font-semibold">
        Which of these best describes your place?
      </h2>

      <form>
        {/* First Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 my-6 md:w-[80%] mx-auto">
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="villa"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("villa")}>
            <GiFamilyHouse className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Villas</h2>
          </div>
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="farm"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("farm")}>
            <FaTreeCity className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Farm House</h2>
          </div>
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="pool"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("pool")}>
            <MdOutlinePool className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Pool House</h2>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 my-10 md:w-[80%] mx-auto">
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="room"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("room")}>
            <MdBedroomParent className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Rooms</h2>
          </div>
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="pg"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("pg")}>
            <IoBedOutline className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">PG</h2>
          </div>
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="flat"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("flat")}>
            <BiBuildingHouse className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Flat</h2>
          </div>
        </div>

        {/* Third Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 my-10 md:w-[80%] mx-auto">
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="cabin"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("cabin")}>
            <GiWoodCabin className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Cabin</h2>
          </div>
          <div className={`flex flex-col items-center justify-center w-32 h-32 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer hover:bg-red-50 ${categorey==="shop"? "bg-red-100 shadow-lg border-2 border-red-600":"bg-white hover:bg-red-50 hover:shadow-lg"}`} onClick={()=>setCategorey("shop")}>
            <SiHomeassistantcommunitystore className="w-8 h-8 text-red-600" />
            <h2 className="mt-2 font-medium text-sm text-center">Shops</h2>
          </div>
        </div>

        {/* Submit Button */}
        <div className="max-w-[80%] flex justify-end mx-auto mb-10">
          <button
            type="submit" onClick={handleListing3}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
          >
            Next
          </button>
        </div>
      </form>
      
      <Chatbot/>
    </>
  );
};

export default Listing2;

