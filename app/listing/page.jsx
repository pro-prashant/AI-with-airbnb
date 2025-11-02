
"use client"
import { ListingContext } from '@/app/context/contextlisting';
import Chatbot from '@/Component/Chatbot';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";


const Listing = () => {
  const { 
           title,setTitle,
           description,setDescription,
           frontendImage1,setFrontendImage1,
           frontendImage2,setFrontendImage2,
           frontendImage3,setFrontendImage3,
           backendImage1,setBackendImage1,
           backendImage2,setBackendImage2,
           backendImage3,setBackendImage3,
           price,setPrice,
           location,setLocation,
           landMark,setLandMark
          } = useContext(ListingContext);
   const handleImageChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage1(file);
      setFrontendImage1(URL.createObjectURL(file));
    }
  };
   const handleImageChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage2(file);
      setFrontendImage2(URL.createObjectURL(file));
    }
  };

  const handleImageChange3 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage3(file);
      setFrontendImage3(URL.createObjectURL(file));
    }
  };
  console.log("check frontend ", location);
  const router = useRouter();
  const handleSubmit = (e)=>{
          e.preventDefault();
          console.log( title,
           description,
           frontendImage1,
           frontendImage2,
           frontendImage3,
           backendImage1,
           backendImage2,
           backendImage3,
           price,
           location,
           landMark,);
  }
  return (
    <>
    <div className="flex items-center justify-between px-6 py-6 bg-white shadow-md">
        <button>
          <FaArrowLeftLong className="text-white bg-red-600 w-10 h-10 rounded-full p-2 cursor-pointer" onClick={()=>router.push("/")} />
        </button>
        <h2 className="text-2xl font-semibold text-white bg-red-600 px-6 py-2 rounded-full">Setup Your Home</h2>
      </div>

      <div className="flex justify-center mt-10 px-4">
        <form onSubmit={handleSubmit}
         
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6 max-h-[75vh] overflow-y-auto scroll-smooth custom-scroll"
        >
          {/* Title */}
          <div>
            <label className="block text-lg font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              required
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
              required
              onChange={(e)=>setDescription(e.target.value)}
             
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            ></textarea>
          </div>

          {/* Images */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor='img1' className="block text-lg font-medium mb-1">Image 1
                <img
                  src={frontendImage1||"/upload.png"}
                  alt="Preview 1"
                  className='w-40 cursor-pointer'
                
                />
              </label>
              <input
                type="file"
                id='img1'
                name="image1"
                hidden
                required
                onChange={handleImageChange1}
             
              />
            </div>
            <div>
              <label htmlFor='img2' className="block text-lg font-medium mb-1">Image 2
                <img
                  src={frontendImage2 || "/upload.png"}
                  alt="Preview 2"
                  className='w-40 cursor-pointer'
                />
              </label>
              <input
                type="file"
                id='img2'
                name="image2"
                hidden
                required
                onChange={handleImageChange2}
               
              />
            </div>
            <div>
              <label htmlFor='img3' className="block text-lg font-medium mb-1">Image 3
                <img
                  src={frontendImage3 || "/upload.png"}
                  alt="Preview 3"
                  className='w-40 cursor-pointer'
                />
              </label>
              <input
                type="file"
                id='img3'
                name="image3"
                hidden
                required
                onChange={handleImageChange3}
             
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
              required
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
              required
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
              required
               onChange={(e)=>setLandMark(e.target.value)}
             
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button onClick={()=>router.push("/listing2")}
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded cursor-pointer"
            >
              Next
            </button>
          </div>
        </form>
      </div>
     
      <Chatbot/>
      </>
  )
}

export default Listing
