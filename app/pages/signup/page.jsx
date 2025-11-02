
"use client"
import React, { useContext, useState } from 'react'
import { UserAuthContext } from '@/app/context/contextauth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Chatbot from '@/app/component/Chatbot';



const Signup = () => {
  const {handleSignup} = useContext(UserAuthContext);
  const router = useRouter();
  // console.log(data);
  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    
  })
  const handleOnchange = (e)=>{
         const {name,value} = e.target;
         setData(prev=>({...prev,[name]:value}))
         }

  const onSubmit = async(e)=>{
    e.preventDefault();
    console.log(data);
      try {
      console.log("Submitting signup with:", data);
      const response = await handleSignup(data); // ✅ pass form data
      
      console.log("Signup successful:", response);
      toast.success("Signup Successfully",response);
      router.push("login")
      // Optional: redirect to login or dashboard
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      toast.error("Signup failed:", err.response?.data || err.message)
    }
    
  }
  return (
    <>
     <div className="w-[100vh] mx-40 mt-20">
      <h2 className="text-2xl">Welcome to Airbnb</h2>
      <form className="mt-20" onSubmit={onSubmit}>
        <h2>UserName</h2>
        <input type="text" name="name" value={data.name} onChange={handleOnchange} required className="border rounded md:w-full h-10"/>
        <h2>Email</h2>
        <input type="text" name="email" value={data.email} onChange={handleOnchange} required  className="border rounded md:w-full h-10" />
        <h2>Password</h2>
        <input type="text" name="password" value={data.password} onChange={handleOnchange} required  className="border rounded md:w-full h-10" />
        <div className="md:flex flex-col items-start">
        <button type='submit' className="bg-red-600 text-white border rounded py-2 w-[100px] cursor-pointer my-6">Signup</button>
        </div>
        <button className="cursor-pointer" >Alredy have an account <span className="text-blue-600" onClick={()=>router.push("login")}>login</span></button>
      </form>
    </div>
         
          <Chatbot/>
    </>
  )
}

export default Signup
