
"use client";

import { useContext, useEffect, useState } from "react";
import { ListingContext } from "@/app/context/contextlisting";
import Card from "@/Component/Card";
import Chatbot from "@/component/Chatbot";
import Navbar from "@/component/Navbar";



export default function Home() {
  const { listing, showData } = useContext(ListingContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showData && showData.length > 0) {
      setLoading(false);
    } else {
      // simulate data fetching (optional delay for better UX)
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showData]);

  return (
    <>
      <div>
        <Navbar />
        <div className="flex items-center justify-center gap-4 flex-wrap md:mt-60 mt-64 px-4">
          {loading ? (
            // 🔹 Skeleton Loader
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white rounded-2xl shadow-md w-72 h-80 flex flex-col"
              >
                
                
                <div className="bg-gray-300 h-44 w-full rounded-t-2xl"></div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : showData && showData.length > 0 ? (
            showData.map((list, index) => (
              <Card
                key={index}
                id={list._id}
                title={list.title}
                description={list.description}
                image1={list.image1}
                image2={list.image2}
                image3={list.image3}
                price={list.price}
                landMark={list.landMark}
                location={list.location}
                isBooked={list.isBooked}
                hostId={list.hostId}
                 rating={list.rating}
              />
            ))
          ) : (
            <p className="text-gray-600 text-lg font-medium">No listings available</p>
          )}
        </div>
      </div>

      <Chatbot />
    </>
  );
}
