"use client";

/*
  viewcard page (client-only)
  - safe for deployment/prerender
  - avoids reading cardDetails.data when undefined
  - sets state after cardDetails arrives
  - uses optional chaining everywhere
  - export dynamic = "force-dynamic" to avoid SSR prerender issues
*/

import React, { useContext, useEffect, useState } from "react";
import { ListingContext } from "../context/contextlisting"; // listing context (contains cardDetails)
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { UserAuthContext } from "../context/contextauth";
import axios from "axios";
import { toast } from "react-toastify";
import { BookingContext } from "../context/contextbook";
import Chatbot from "@/component/Chatbot";

const Page = () => {
  // router for navigation
  const router = useRouter();

  // contexts (may be undefined during SSR/prerender) — we'll guard usage
  const { userInfo } = useContext(UserAuthContext) ?? {}; // safe fallback
  const { cardDetails } = useContext(ListingContext) ?? {}; // safe fallback
  const bookingCtx = useContext(BookingContext) ?? {}; // safe fallback for booking functions/state

  // Local UI state — initialize with safe defaults (don't read cardDetails here)
  const [updatePop, setUpdatePop] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frontendImage1, setFrontendImage1] = useState(null);
  const [frontendImage2, setFrontendImage2] = useState(null);
  const [frontendImage3, setFrontendImage3] = useState(null);
  const [backendImage1, setBackendImage1] = useState("");
  const [backendImage2, setBackendImage2] = useState("");
  const [backendImage3, setBackendImage3] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [landMark, setLandMark] = useState("");
  const [showbookcard, setShowbookcard] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [loading, setLoading] = useState(true); // page-level loading until cardDetails available

  // booking context values (use safe defaults if undefined)
  const {
    checkIn = "",
    setCheckIn = () => {},
    checkOut = "",
    setCheckOut = () => {},
    total = 0,
    setTotal = () => {},
    night = 0,
    setNight = () => {},
    handleBook = async () => {},
  } = bookingCtx;

  // When cardDetails becomes available, copy it into local state
  useEffect(() => {
    const card = cardDetails?.data;
    if (card) {
      setTitle(card.title ?? "");
      setDescription(card.description ?? "");
      setBackendImage1(card.image1 ?? "");
      setBackendImage2(card.image2 ?? "");
      setBackendImage3(card.image3 ?? "");
      setPrice(card.price ?? 0);
      setLocation(card.location ?? "");
      setLandMark(card.landMark ?? "");
      setLoading(false); // we have the data; remove loading
    } else {
      // If not available yet, remain loading
      setLoading(true);
    }
  }, [cardDetails]);

  // compute minDate once (today)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  // compute nights & total whenever checkIn/checkOut or price changes
  useEffect(() => {
    // only compute if checkIn/checkOut are valid dates and we have price
    if (!checkIn || !checkOut || !price) {
      setNight(0);
      setTotal(0);
      return;
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      setNight(0);
      setTotal(0);
      return;
    }

    const n = Math.max(0, (outDate - inDate) / (24 * 60 * 60 * 1000));
    setNight(n);

    const airbnbCharge = (price * 6) / 100;
    const tax = (price * 2) / 100;
    if (n > 0) {
      setTotal(Math.round(price * n + (airbnbCharge + tax)));
    } else {
      setTotal(0);
    }
    // note: intentionally not depending on setNight/setTotal
  }, [checkIn, checkOut, price, setNight, setTotal]);

  // Image change handlers (update frontend preview and backend file state)
  const handleImageOnchange1 = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage1(file);
      setFrontendImage1(URL.createObjectURL(file));
    }
  };
  const handleImageOnchange2 = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage2(file);
      setFrontendImage2(URL.createObjectURL(file));
    }
  };
  const handleImageOnchange3 = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage3(file);
      setFrontendImage3(URL.createObjectURL(file));
    }
  };

  // Update listing API call — uses id passed (or fallback to cardDetails id)
  const handleUpdate = async (id) => {
    try {
      const listingId = id ?? cardDetails?.data?._id;
      if (!listingId) {
        toast.error("Listing id missing");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("landMark", landMark);

      if (backendImage1) formData.append("backendImage1", backendImage1);
      if (backendImage2) formData.append("backendImage2", backendImage2);
      if (backendImage3) formData.append("backendImage3", backendImage3);

      const response = await axios.put(`/api/listing/updateById/${listingId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response?.data?.message || "Updated Successfully");
      router.push("/");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to Update listing!");
    }
  };

  // Delete listing API call
  const handleDelete = async () => {
    try {
      const id = cardDetails?.data?._id;
      if (!id) {
        toast.error("Listing id missing");
        return;
      }
      const response = await axios.delete(`/api/listing/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(response?.data?.message || "Listing deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete listing!");
    }
  };

  // If still loading (cardDetails not present yet) — show loading UI to avoid SSR crash
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading listing details...</p>
      </div>
    );
  }

  // Safe alias to card object now that loading is false
  const card = cardDetails?.data ?? {};

  // Render UI using optional chaining and local state
  return (
    <>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 my-4 mx-4">
        <button onClick={() => router.push("/")}>
          <FaArrowLeftLong className="text-white bg-red-600 w-10 h-10 rounded-full p-2 cursor-pointer" />
        </button>
        <div className="sm:ml-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {`In ${card.landMark?.toUpperCase() || ""} , ${card.location?.toUpperCase() || ""}`}
          </h2>
        </div>
      </div>

      {/* Image Grid */}
      <div className="border shadow-lg w-[95%] md:w-[80%] mx-auto my-6 md:my-10 max-h-[600px] p-4 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
          <div className="w-full h-full">
            {/* Use card.image1 safely */}
            {card.image1 ? (
              // note: next/image requires allowed external domains when using external URLs in production
              <Image
                src={card.image1}
                alt="img1"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-md" />
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            {card.image2 ? (
              <Image
                src={card.image2}
                alt="img2"
                width={800}
                height={400}
                className="w-full h-48 md:h-44 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 md:h-44 bg-gray-100 rounded-md" />
            )}
            {card.image3 ? (
              <Image
                src={card.image3}
                alt="img3"
                width={800}
                height={400}
                className="w-full h-48 md:h-44 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 md:h-44 bg-gray-100 rounded-md" />
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 md:px-20 py-2 my-4">
        <h2 className="text-lg md:text-xl font-bold">
          {`${(card.title || "").toUpperCase()}, ${(card.description || "").toUpperCase()}`}
        </h2>

        <h2 className="text-xl font-semibold my-2">{`Rs. ${card.price ?? 0}`}</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {/* Protect userInfo access */}
          {card.hostId && userInfo?._id && card.hostId === userInfo._id && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
              onClick={() => setUpdatePop((prev) => !prev)}
            >
              Edit Listing
            </button>
          )}

          {card.hostId && userInfo?._id && card.hostId !== userInfo._id && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
              onClick={() => setShowbookcard((prev) => !prev)}
            >
              Booking
            </button>
          )}
        </div>
      </div>

      {/* Update Listing modal */}
      {updatePop && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-[#000000e3] bg-opacity-70 z-50">
          <div
            className="bg-red-600 text-white w-8 h-8 mx-4 my-4 px-2 py-2 rounded-lg cursor-pointer"
            onClick={() => setUpdatePop(false)}
          >
            <ImCross className="w-4 h-4 " />
          </div>

          {/* Form Data */}
          <div className="flex justify-center mt-10 px-4">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6 max-h-[80vh] overflow-y-auto scroll-smooth custom-scroll"
            >
              {/* Title */}
              <div>
                <label className="block text-lg font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Images */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="img1" className="block text-lg font-medium mb-1">
                    Image 1
                    <img
                      src={
                        frontendImage1
                          ? frontendImage1
                          : typeof backendImage1 === "string" && backendImage1
                          ? backendImage1
                          : "/upload.png"
                      }
                      alt="Preview 1"
                      className="w-40 cursor-pointer"
                    />
                  </label>
                  <input type="file" id="img1" name="image1" hidden onChange={handleImageOnchange1} />
                </div>

                <div>
                  <label htmlFor="img2" className="block text-lg font-medium mb-1">
                    Image 2
                    <img
                      src={
                        frontendImage2
                          ? frontendImage2
                          : typeof backendImage2 === "string" && backendImage2
                          ? backendImage2
                          : "/upload.png"
                      }
                      alt="Preview 2"
                      className="w-40 cursor-pointer"
                    />
                  </label>
                  <input type="file" id="img2" name="image2" hidden onChange={handleImageOnchange2} />
                </div>

                <div>
                  <label htmlFor="img3" className="block text-lg font-medium mb-1">
                    Image 3
                    <img
                      src={
                        frontendImage3
                          ? frontendImage3
                          : typeof backendImage3 === "string" && backendImage3
                          ? backendImage3
                          : "/upload.png"
                      }
                      alt="Preview 3"
                      className="w-40 cursor-pointer"
                    />
                  </label>
                  <input type="file" id="img3" name="image3" hidden onChange={handleImageOnchange3} />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-lg font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-lg font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-lg font-medium mb-1">LandMark</label>
                <input
                  type="text"
                  name="landmark"
                  value={landMark}
                  onChange={(e) => setLandMark(e.target.value)}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(card._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
                >
                  Update Listing
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete()}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
                >
                  Delete Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Card */}
      {showbookcard && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-[#fcfcfc] opacity-100 z-50 overflow-y-auto">
          <div className="bg-red-600 text-white w-8 h-8 mx-4 my-4 px-2 py-2 rounded-lg cursor-pointer">
            <ImCross className="w-4 h-4" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 px-4 pb-20">
            {/* Booking Form Card */}
            <div className="w-full max-w-md border bg-gray-600 opacity-90 rounded-2xl my-6 p-4">
              <h2 className="text-center text-2xl font-bold text-white mb-4 border-b pb-2">Confirm and Book</h2>

              <p className="text-white">Your Trip -</p>

              <div className="my-4">
                <label className="block text-white mb-1">CheckIn</label>
                <input
                  type="date"
                  min={minDate}
                  className="w-full border-2 rounded p-1"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div className="my-4">
                <label className="block text-white mb-1">CheckOut</label>
                <input
                  type="date"
                  min={minDate}
                  className="w-full border-2 rounded p-1"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={async () => {
                    await handleBook(card._id);
                    router.push("/book");
                  }}
                  className="bg-gray-600 hover:bg-gray-800 rounded text-white px-4 py-2 cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="w-full max-w-md border bg-gray-600 opacity-90 rounded-2xl my-6 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded shadow mb-4">
                <div className="p-2">
                  <img src={card.image1} alt="listing" className="w-full h-auto rounded" />
                </div>
                <div className="p-2 flex flex-col justify-center">
                  <p className="font-bold">{card.title}, {card.description}</p>
                  <p className="font-bold">{card.location}, {card.landMark}</p>
                </div>
              </div>

              <div className="bg-white rounded shadow p-4">
                <h2 className="text-2xl font-bold mb-4">Booking Price</h2>
                <div className="flex justify-between">
                  <span>{(card.price ?? 0)} x {night ?? 0} nights</span>
                  <span>{(card.price ?? 0) * (night ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{Math.round((card.price ?? 0) * 2 / 100)}</span>
                </div>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span>Airbnb Charge</span>
                  <span>{Math.round((card.price ?? 0) * 6 / 100)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Chatbot />
    </>
  );
};

export default Page;

// Prevent Next.js from trying to prerender this page at build-time
export const dynamic = "force-dynamic";
