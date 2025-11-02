"use client";
import React, { useContext } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaRegSadTear } from "react-icons/fa";
import { UserAuthContext } from "../context/contextauth";

const Page = () => {
  const { userInfo } = useContext(UserAuthContext);
  console.log("check user booking Data", userInfo);

  const hasBooking = userInfo && userInfo.booking; // 👈 check if user has booking data

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        {hasBooking ? (
          <>
            {/* ✅ Booking Found */}
            <div className="flex justify-center mb-6">
              <FaCircleCheck className="text-green-500 w-20 h-20" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Booking Details 📋
            </h1>
            <p className="text-gray-500 mb-6">
              Below are your saved booking details from your account.
            </p>

            <div className="bg-gray-100 rounded-lg p-4 text-left mb-6">
              <div className="flex justify-between py-1 text-sm">
                <span className="font-medium">User Name:</span>
                <span>{userInfo?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="font-medium">Email:</span>
                <span>{userInfo?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="font-medium">Booking ID:</span>
                <span>{userInfo?.booking?.[0] || "N/A"}</span>
              </div>
              
            </div>
          </>
        ) : (
          <>
            {/* ❌ No Booking Found */}
            <div className="flex justify-center mb-6">
              <FaRegSadTear className="text-gray-400 w-20 h-20" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              No Bookings Yet 😕
            </h1>
            <p className="text-gray-500 mb-6">
              You haven’t booked any Airbnb stay yet. Explore and find your next trip!
            </p>

            <button
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => (window.location.href = "/")}
            >
              Browse Listings
            </button>
          </>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            className="text-red-600 hover:text-red-700 underline text-sm cursor-pointer"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
