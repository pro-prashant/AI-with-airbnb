"use client";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { BookingContext } from "../context/contextbook";

const Page = () => {
  const router = useRouter();
  const { bookingData } = useContext(BookingContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <FaCircleCheck className="text-green-500 w-20 h-20" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Booking Confirmed 🎉
        </h1>
        <p className="text-gray-500 mb-6">Your stay has been successfully booked!</p>

        {/* Booking Details */}
        <div className="bg-gray-100 rounded-lg p-4 text-left mb-6">
          <div className="flex justify-between py-1 text-sm">
            <span className="font-medium">Booking ID:</span>
            <span>{bookingData?._id || "N/A"}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="font-medium">Host Email:</span>
            <span>{bookingData?.host?.email || "N/A"}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="font-medium">Total Rent:</span>
            <span>₹{bookingData?.TotalRent || 0}</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            className="text-red-600 hover:text-red-700 underline text-sm"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
