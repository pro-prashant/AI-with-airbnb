
"use client"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import Card from "../component/Card";

import { UserAuthContext } from "../context/contextauth";
import Chatbot from "../component/Chatbot";

const page = () => {
  const navigate = useRouter();
  const {userInfo} = useContext(UserAuthContext);
  console.log("check listing data",userInfo?.listing)
 const handleNavigate = ()=>{
    navigate.push("/");
  }
  return (
    <>
     <div>
       <div className="w-fit h-fit border-2 border-black mx-auto my-6 p-2 px-40 ">
      <h2 className='text-2xl'>MY LISTING</h2>
      </div>
      <div className='mx-2'>
        <button onClick={handleNavigate}>
         <FaArrowLeftLong className="text-white bg-red-600 w-10 h-10 rounded-full p-2 cursor-pointer" />
             </button>
      </div>
      
                        <div className='flex items-center justify-center'>
                              <div className='flex items-center justify-center gap-2 flex-wrap w-full' >
                 {userInfo?.listing?.map((list,index)=>(
                       <Card key={index} title={list.title} description={list.description} landMark={list.landMark} image1={list.image1} image2={list.image2} image3={list.image3} price={list.price} location={list.location} id={list.id}/> 
                 ))  }
       </div>      
       
                        </div>
    </div>
    
    <Chatbot/>
    </>
  )
}

export default page
