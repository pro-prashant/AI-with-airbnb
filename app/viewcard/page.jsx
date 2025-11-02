
"use client"
import React, { useContext, useEffect, useState } from 'react';
import { ListingContext } from '../context/contextlisting';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImCross } from "react-icons/im";
import { UserAuthContext } from '../context/contextauth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BookingContext } from '../context/contextbook';
import Chatbot from '../component/Chatbot';

const Page = () => {
  const router = useRouter();
  const {userInfo, setUserInfo} = useContext(UserAuthContext);
  const { cardDetails, } = useContext(ListingContext);
  const [updatePop,setUpdatePop] = useState(false);
  const [title,setTitle] = useState(cardDetails.data.title);
  const [description,setDescription] = useState(cardDetails.data.description);
  const [frontendImage1,setFrontendImage1] = useState();
  const [frontendImage2,setFrontendImage2] = useState();
  const [frontendImage3,setFrontendImage3] = useState();
  const [backendImage1,setBackendImage1] = useState(cardDetails.data.image1);
  const [backendImage2,setBackendImage2] = useState(cardDetails.data.image2);
  const [backendImage3,setBackendImage3] = useState(cardDetails.data.image3);
  const [price,setPrice] = useState(cardDetails.data.price);
  const [location,setLocation] = useState(cardDetails.data.location);
  const [landMark,setLandMark] = useState(cardDetails.data.landMark);
  const [showbookcard,setShowbookcard] = useState(false);
  const [minDate, setMinDate] = useState("");

  console.log("check details to card", cardDetails);
  console.log("User infor",userInfo._id);
  const { checkIn,setCheckIn,checkOut,setCheckOut,total,setTotal,night,setNight,handleBook} = useContext(BookingContext)
            console.log("checkIn and checkOut",checkIn,checkOut);    
        
     useEffect(()=>{
           const inDate = new Date(checkIn);
           const outDate = new Date(checkOut);
           const n = (outDate-inDate)/(24*60*60*1000);
                setNight(n);
           const airbnbCharge = (cardDetails.data.price*6/100);
           const tax =( cardDetails.data.price*2/100);
           if(n>0){
                     setTotal(cardDetails.data.price*n +(airbnbCharge+tax));
           }else{
                  setTotal(0);
           }
     },[checkIn,checkOut,total,cardDetails.data.price])
  useEffect(()=>{
         const today = new Date().toISOString().split("T")[0];
          setMinDate(today);
      },[])

      console.log("total check",total);

   const handleImageOnchange1 = (e)=>{
         const file = e.target.files[0];
         if(file){
            setBackendImage1(file);
            setFrontendImage1(URL.createObjectURL(file));
         }
   }
   const handleImageOnchange2 = (e)=>{
         const file = e.target.files[0];
         if(file){
            setBackendImage2(file);
            setFrontendImage2(URL.createObjectURL(file));
         }
   }
   const handleImageOnchange3 = (e)=>{
         const file = e.target.files[0];
         if(file){
            setBackendImage3(file);
            setFrontendImage3(URL.createObjectURL(file));
         }
   }

 const handleUpdate = async (id) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("landMark", landMark);

    if (backendImage1) formData.append("backendImage1", backendImage1);
    if (backendImage2) formData.append("backendImage2", backendImage2);
    if (backendImage3) formData.append("backendImage3", backendImage3);

    const response = await axios.put(`/api/listing/updateById/${id}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("Update success:", response.data);
    toast.success(response.message || "Updated Successfully");
    router.push("/");
     
  } catch (error) {
    console.error("Update failed:", error);
    toast.error( error.response?.data?.message || "Failed to Update listing!")

  }
};

const handleDelete = async (id) => {
    
  try {
    const id = cardDetails.data._id;
    const response = await axios.delete(`/api/listing/delete/${id}`, {
      withCredentials: true,
    });

    const result = response.data;
    console.log("Delete Success:", result);
    toast.success(result.message || "Listing deleted successfully!");
    router.push("/");
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error(
      error.response?.data?.message || "Failed to delete listing!"
    );
  }
};




  return (
    <>
                         
      {/* Top Header  */}
       <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 my-4 mx-4'>
        <button onClick={() => router.push("/")}>
          <FaArrowLeftLong className="text-white bg-red-600 w-10 h-10 rounded-full p-2 cursor-pointer" />
        </button>
        <div className='sm:ml-6'>
          <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>
            {`In ${cardDetails.data.landMark?.toUpperCase()} , ${cardDetails.data.location?.toUpperCase()}`}
          </h2>
        </div>
      </div>

      {/* Image Grid */}
      <div className="border shadow-lg w-[95%] md:w-[80%] mx-auto my-6 md:my-10 max-h-[600px] p-4 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
          <div className='w-full h-full'>
            <Image src={cardDetails.data.image1} alt="img1" width={300} height={400} className='w-full h-full object-cover rounded-md'/>
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Image src={cardDetails.data.image2} alt="img2" width={300} height={400} className='w-full h-48 md:h-44 object-cover rounded-md'/>
            <Image src={cardDetails.data.image3} alt="img3" width={300} height={400} className='w-full h-48 md:h-44 object-cover rounded-md'/>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className='px-4 md:px-20 py-2 my-4'>
        <h2 className='text-lg md:text-xl font-bold'>
          {`${cardDetails.data.title?.toUpperCase()}, ${cardDetails.data.description?.toUpperCase()}`}
        </h2>
       
        <h2 className='text-xl font-semibold my-2'>
          {`Rs. ${cardDetails.data.price}`}
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {cardDetails.data.hostId === userInfo._id && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
              onClick={() => setUpdatePop(prev => !prev)}
            >
              Edit Listing
            </button>
          )}
          {cardDetails.data.hostId !== userInfo._id && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
              onClick={() => setShowbookcard(prev => !prev)}
            >
              Booking
            </button>
          )}
        </div>
      </div>
                                             {/* Update Listing  */}
         {updatePop && (
   <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-[#000000e3] bg-opacity-70 z-50">
       <div className="bg-red-600 text-white w-8 h-8 mx-4 my-4 px-2 py-2 rounded-lg cursor-pointer" onClick={()=>setUpdatePop(false)}>
         <ImCross className="w-4 h-4 "/>
       </div>
                                 {/* Form Data */}
                     <div className="flex justify-center mt-10 px-4">
        <form onSubmit={(e)=>e.preventDefault()}
          
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6 max-h-[80vh] overflow-y-auto scroll-smooth custom-scroll"
        >
          {/* Title */}
          <div>
            <label className="block text-lg font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
           
             
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
              onChange={(e)=>setDescription(e.target.value)}
           
            
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            ></textarea>
          </div>

         {/* Images */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor='img1' className="block text-lg font-medium mb-1">Image 1
                <img
                  src={frontendImage1
      ? frontendImage1
      : typeof backendImage1 === "string"
        ? backendImage1
        : "/upload.png"}
                  alt="Preview 1"
                  className='w-40 cursor-pointer'
                
                />
              </label>
              <input
                type="file"
                id='img1'
                name="image1"
                hidden
                onChange={handleImageOnchange1}
             
              />
            </div>
            <div>
              <label htmlFor='img2' className="block text-lg font-medium mb-1">Image 2
                <img
                  src={frontendImage2
      ? frontendImage2
      : typeof backendImage2 === "string"
        ? backendImage2
        : "/upload.png"}
                  alt="Preview 2"
                  className='w-40 cursor-pointer'
                />
              </label>
              <input
                type="file"
                id='img2'
                name="image2"
                hidden
                onChange={handleImageOnchange2}
               
              />
            </div>
            <div>
              <label htmlFor='img3' className="block text-lg font-medium mb-1">Image 3
                <img
                  src={frontendImage3
      ? frontendImage3
      : typeof backendImage3 === "string"
        ? backendImage3
        : "/upload.png"}
                  alt="Preview 3"
                  className='w-40 cursor-pointer'
                />
              </label>
              <input
                type="file"
                id='img3'
                name="image3"
                hidden
                onChange={handleImageOnchange3}
             
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-lg font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
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
              onChange={(e)=>setLocation(e.target.value)}
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
              onChange={(e)=>setLandMark(e.target.value)}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <button
              type="submit" onClick={()=>handleUpdate(cardDetails.data._id)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
                >
             Update Listing
            </button>
            <button
              type="submit" onClick={()=>handleDelete()}
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
    await handleBook(cardDetails.data._id);
    router.push("/book");
  }}

  className="bg-gray-600 hover:bg-gray-800 rounded text-white px-4 py-2 cursor-pointer"
  >Book Now
</button>


        </div>
      </div>

      {/* Price Summary Card */}
      <div className="w-full max-w-md border bg-gray-600 opacity-90 rounded-2xl my-6 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded shadow mb-4">
          <div className="p-2">
            <img src={cardDetails.data.image1} alt="listing" className="w-full h-auto rounded" />
          </div>
          <div className="p-2 flex flex-col justify-center">
            <p className="font-bold">{cardDetails.data.title}, {cardDetails.data.description}</p>
            <p className="font-bold">{cardDetails.data.location}, {cardDetails.data.landMark}</p>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-2xl font-bold mb-4">Booking Price</h2>
          <div className="flex justify-between">
            <span>{cardDetails?.data?.price??0} x {night ?? 0} nights</span>
            <span>{cardDetails?.data?.price * night || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{(cardDetails?.data?.price * 2 / 100).toFixed(0)}</span>
          </div>
          <div className="flex justify-between border-b pb-2 mb-2">
            <span>Airbnb Charge</span>
            <span>{(cardDetails?.data?.price * 6 / 100).toFixed(0)}</span>
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
             <Chatbot/>
    </>
  );
};

export default Page;
