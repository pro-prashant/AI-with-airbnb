
"use client"
import { ListingContext } from '@/app/context/contextlisting';
import Chatbot from '@/Component/Chatbot';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";

const Listing3 = () => {
    const {
           title,setTitle,
           description,setDescription,
           frontendImage1,setFrontendImage1,
           frontendImage2,setFrontendImage2,
           frontendImage3,setFrontendImage3,
           price,setPrice,
           location,setLocation,
           landMark,setLandMark,
           loading ,setLoading,
           handleCreateListing,
          
    } = useContext(ListingContext)
      const router = useRouter();
      const handleListing2 = ()=>{
            router.push("/listing2")
      }
  return (
    <>
     <div>
      {/* Top Header */}
      <div className='flex items-center gap-6 my-4 mx-6'>
        <button onClick={handleListing2}>
          <FaArrowLeftLong className="text-white bg-red-600 w-10 h-10 rounded-full p-2 cursor-pointer" />
        </button>
        <div className='ml-12'>
          <h2 className='text-2xl'>{`In ${landMark.toUpperCase()} , ${location.toUpperCase()}`}</h2>
        </div>
      </div>

      {/* Image Grid Section */}
      <div className="border shadow-lg max-w-[80%] mx-auto my-10 h-[400px] p-4 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-[2px] h-full">
          
          {/* Left Big Image */}
          <div className='w-full'>
            <img 
              src={frontendImage1} 
              alt="img" 
              className='w-full  object-cover rounded-md'
            />
          </div>

          {/* Right Two Smaller Images */}
          <div className='flex flex-col w-full'>
            <img 
              src={frontendImage2}
              alt="img2" 
              className='w-full h-44 object-cover rounded-md'
            />
            <img 
              src={frontendImage3}
              alt="img3" 
              className='w-full h-44 object-cover rounded-md my-4'
            />
          </div>

        </div>
      </div>

      <div className='ml-40 py-2 my-4'>
       <h2>{`${title.toUpperCase()}, ${description.toUpperCase()}`}</h2> 
       <h2>{`Rs.${price}`}</h2>
        <button
              type="submit" onClick={() => {
   handleCreateListing();
   router.push("./");
}} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer my-2"
            >
               {loading ? "Creating..." : "Add Listing"}
            </button>
            
      </div>
    </div>
    
     <Chatbot/>

    </>
  )
}

export default Listing3
