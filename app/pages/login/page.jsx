
"use client"
import Chatbot from '@/app/component/Chatbot'
import { UserAuthContext } from '@/app/context/contextauth'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'

const login = () => {

const [data,setData] = useState({
   email:"",
   password:"",
})
const router = useRouter();
const {handleLogin,userInfo,setUserInfo} = useContext(UserAuthContext);
console.log("UserInfo Data Check",userInfo);

   const handleOnChange = (e)=>{
     const {name, value} = e.target;
     setData(prev=>({...prev,[name]:value}));

   }
    const onSubmit = async(e)=>{
     try{
       e.preventDefault();
      console.log(data);
      const response = await handleLogin(data);
      console.log(response);
      toast.success("Login Successfully",response);
      router.push("/");
      }catch(error){
           console.log(error);
           toast.error("Login Failed", error);
      }
    }

  return (
    <>
     <div className="w-[100vh] mx-40 mt-20">
      <h2 className="text-2xl">Welcome to Airbnb</h2>
      <form onSubmit={onSubmit} className="mt-20">
        <h2>Email</h2>
        <input
          type="email"
          name="email"
          value={data.email}
          required
          onChange={handleOnChange}
          className="border rounded md:w-full h-10"
        />

        <h2>Password</h2>
        <input
          type="password"
          name="password"
          value={data.password}
          required
          onChange={handleOnChange}
          className="border rounded md:w-full h-10"
        />

        <div className="md:flex flex-col items-start">
          <button type="submit" className="bg-red-600 text-white border rounded py-2 w-[100px] cursor-pointer my-6">
            Login
          </button>
        </div>

        <button type="button" className="cursor-pointer">
          Don't have an account? <span className="text-blue-600" onClick={()=>router.push("signup")}>Sign up</span>
        </button>
      </form>
    </div>
    <Chatbot/>
  </>
  )
}

export default login
