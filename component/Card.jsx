"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { UserAuthContext } from "@/context/contextauth";
import { ListingContext } from "@/context/contextlisting";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { BookingContext } from "@/app/context/contextbook";


const Card = ({
  id,
  title,
  description,
  landMark,
  location,
  image1,
  image2,
  image3,
  price,
  isBooked,
  hostId,
}) => {
  const [showPop, setShowPop] = useState(false);
  const router = useRouter();
  const { userInfo } = useContext(UserAuthContext);
  const { handleViewCard } = useContext(ListingContext);
  const { DeleteBook } = useContext(BookingContext);

  const HandleViewCard = async () => {
    if (userInfo) {
      await handleViewCard(id);
      toast.success("Card Detail", handleViewCard);
      router.push("/viewcard");
    }
  };

  return (
    <div
      className="w-[300px] relative h-[400px] my-2 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={() => (!isBooked ? HandleViewCard() : null)}
    >
      {/* Booked */}
      {isBooked && (
        <div className="absolute right-0 bg-white rounded text-green m-4 h-6 flex items-center px-2">
          <FaCheckCircle className="text-[#06bd43]" />
          <h2 className="text-[#06bd43] text-center font-bold text-sm px-[2px]">BOOKED</h2>
        </div>
      )}

      {/* Cancel Booking */}
      {isBooked && hostId == userInfo?._id && (
        <div className="absolute right-0 top-8 bg-white rounded my-4 mx-1 h-6 flex items-center px-2">
          <TiCancel className="text-[red]" />
          <h2 className="text-[red] text-center font-bold text-sm px-[2px]" onClick={() => setShowPop(true)}>
            CANCEL BOOKING
          </h2>
        </div>
      )}

      {/* Cancel Popup */}
      {showPop && (
        <div className="absolute right-10 top-20 bg-white rounded shadow-md w-[200px] h-[80px] px-2">
          <h2 className="text-center my-2">Are You Sure?</h2>
          <div className="flex items-center justify-between mx-2">
            <button
              className="bg-[red] text-white px-2 rounded cursor-pointer"
              onClick={() => {
                DeleteBook(id);
                setShowPop(false);
              }}
            >
              Yes
            </button>
            <button className="bg-gray-400 text-white px-2 rounded cursor-pointer" onClick={() => setShowPop(false)}>
              No
            </button>
          </div>
        </div>
      )}

      {/* Images */}
      <div className="w-full h-[60%] flex overflow-x-auto scrollbar-hide rounded-t-xl">
        {[image1, image2, image3].map(
          (img, idx) =>
            img && <Image key={idx} src={img} alt={`img-${idx}`} className="w-full flex-shrink-0 object-cover" width={500} height={500} />
        )}
      </div>

      {/* Text */}
      <div className="p-4 h-[30%] flex flex-col justify-between">
        <div className="text-sm text-gray-600">
          In <span className="font-semibold text-gray-800">{landMark?.toUpperCase()}, {location?.toUpperCase()}</span>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 truncate">{title?.toUpperCase()}</h2>
        </div>

        <span className="text-md font-semibold mt-1">₹ {price}/Month</span>
      </div>
    </div>
  );
};

export default Card;
