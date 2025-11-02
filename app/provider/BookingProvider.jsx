"use client";
import React, { useState, useEffect } from "react";
import { BookingContext } from "../context/contextbook";
import axios from "axios";
import { toast } from "react-toastify";

const BookingProvider = ({ children }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [night, setNight] = useState(0);
  const [total, setTotal] = useState(0);
  const [bookingData, setBookingData] = useState(null);

  // ✅ Create booking
  const handleBook = async (listingId) => {
    try {
      if (!checkIn || !checkOut || !total) {
        toast.error("Please select valid dates and total amount!");
        return;
      }

      const response = await axios.post(
        `/api/book/Createbook/${listingId}`,
        {
          CheckIn: checkIn,
          CheckOut: checkOut,
          TotalRent: total,
          status: "booked",
        },
        { withCredentials: true }
      );

      const booking = response.data.booking || response.data;

      setBookingData(booking); // update state
      console.log("📦 Booking to be set:", booking); // immediate log (raw data)
      toast.success("✅ Booking successful!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Something went wrong during booking");
    }
  };

  // ✅ Delete booking (update UI instantly)
  const DeleteBook = async (id) => {
    try {
      await axios.delete(`/api/book/delete/${id}`, { withCredentials: true });

      // 👇 Instantly remove booking from UI
      if (bookingData && bookingData._id === id) {
        setBookingData(null);
      }

      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Delete booking error:", error);
      toast.error("Error deleting booking");
    }
  };

  // 🧠 Log when bookingData changes
  useEffect(() => {
    if (bookingData) {
      console.log("✅ bookingData updated:", bookingData);
    } else {
      console.log("ℹ️ bookingData is null or reset");
    }
  }, [bookingData]);

  // ✅ Context value
  const value = {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    total,
    setTotal,
    night,
    setNight,
    handleBook,
    DeleteBook,
    bookingData,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;
