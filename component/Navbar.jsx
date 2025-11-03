"use client";
import React, { useContext, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdMenu, MdWhatshot, MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi"; 
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserAuthContext } from "@/app/context/contextauth";
import { ListingContext } from "@/app/context/contextlisting";
import { toast } from 'react-toastify';


const Navbar = () => {
    const navigate = useRouter();
    const [showMenu, setShowMenu] = useState(true);
    const [input,setInput] = useState("");

    const { userInfo, userProfile } = useContext(UserAuthContext);
    const { listingSearch, handleListingSearch, handleViewCard } = useContext(ListingContext);

    // Navigate to login
    const handleNaviget = () => navigate.push("/pages/login");

    // Logout
    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
            toast.success("Logout Successfully");
            navigate.push("/pages/login");
        } catch (error) {
            toast.error("Logout Failed");
            console.error("Logout Failed:", error);
        } 
    }

    // View listing card
    const HandleViewCard = async (id) => {
        if (userInfo) {
            await handleViewCard(id);
            navigate.push("/viewcard");
        } else {
            navigate.push("/login");
        }
    };

    // Debounced search
    useEffect(() => {
        const delay = setTimeout(() => {
            handleListingSearch(input);
        }, 400);
        return () => clearTimeout(delay);
    }, [input]);

    // Search by category
    const handleCategorySearch = (category) => {
        setInput(category);
        handleListingSearch(category);
    }

    return (
        <div className="fixed top-0 w-full bg-white z-50">
            {/* Top Navbar */}
            <div className="flex items-center justify-between border px-6 md:px-5 py-2">
                <img src="/logo.png" alt="logo" className="md:w-[150px] md:h-[100px] w-[80px] h-[60px]" />

                {/* Desktop Search */}
                <div className="relative md:block hidden">
                    <input
                        type="text"
                        className="w-[600px] h-10 border rounded-2xl p-2"
                        placeholder="Any Where | Any Location | Any City"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <span className="absolute right-2 top-1 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                        <FaSearch className="text-white" />
                    </span>
                </div>

                {/* User Controls */}
                <div className="flex items-center space-x-2">
                    <p className="hidden md:block">List Your Home</p>
                    <div
                        className="border border-black rounded-2xl p-2 flex items-center cursor-pointer"
                        onClick={() => setShowMenu(prev => !prev)}
                    >
                        <MdMenu className="w-6 h-6" />
                        {userProfile ? (
                            <span className="bg-black text-white rounded-full px-2 py-1 text-sm ml-1">{userProfile}</span>
                        ) : (
                            <CgProfile className="w-6 h-6 ml-1" />
                        )}
                    </div>
                </div>

                {/* Dropdown Menu */}
                <div className={`absolute md:right-10 right-2 top-20 w-48 bg-[#f2f4f7] border-2 rounded-lg transition duration-300 ${showMenu ? 'hidden' : 'block'}`}>
                    <ul className="flex flex-col items-start justify-center p-4 space-y-2">
                        {userInfo ? (
                            <li className="hover:bg-[#8f9cb3] w-full px-4 py-1 rounded cursor-pointer" onClick={handleLogout}>Logout</li>
                        ) : (
                            <li className="hover:bg-[#8f9cb3] w-full px-4 py-1 rounded cursor-pointer" onClick={handleNaviget}>Login</li>
                        )}
                        <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                        <li className="hover:bg-[#8f9cb3] w-full px-4 py-1 rounded cursor-pointer" onClick={() => navigate.push("/listing")}>Listing Create</li>
                        <li className="hover:bg-[#8f9cb3] w-full px-4 py-1 rounded cursor-pointer" onClick={() => navigate.push("/mylisting")}>My Listing</li>
                        <li className="hover:bg-[#8f9cb3] w-full px-4 py-1 rounded cursor-pointer" onClick={() => navigate.push("/checkbooking")}>Check Booking</li>
                    </ul>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="flex items-center justify-center md:hidden mt-2 relative px-4">
                <input
                    type="text"
                    className="w-[200px] h-10 border rounded-2xl p-2"
                    placeholder="Any Location"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <span className="absolute right-6 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                    <FaSearch className="text-white" />
                </span>
            </div>

            {/* Search Results */}
            {listingSearch?.length > 0 && (
                <div className="absolute z-50 top-20 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-white border rounded-md shadow-lg overflow-y-auto max-h-[300px] px-4 py-2">
                    {listingSearch.map((search) => (
                        <div key={search._id} className="py-2 border-b cursor-pointer hover:bg-gray-100" onClick={() => HandleViewCard(search._id)}>
                            <strong>{search.title}</strong>, in {search.location}, near {search.landMark}
                        </div>
                    ))}
                </div>
            )}

            {/* Category Navigation */}
            <div className='overflow-x-auto whitespace-nowrap px-4 md:px-0'>
                <div className='flex items-center md:justify-center my-6 gap-[40px] px-2'>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Flat")}>
                        <MdWhatshot className='w-8 h-8'/>
                        <span className='text-sm'>Trending</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Villa")}>
                        <GiFamilyHouse className='w-8 h-8'/>
                        <span className='text-sm'>Villa</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Farm House")}>
                        <FaTreeCity className='w-8 h-8'/>
                        <span className='text-sm'>Farm House</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Pool House")}>
                        <MdOutlinePool className='w-8 h-8'/>
                        <span className='text-sm'>Pool House</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Flat")}>
                        <BiBuildingHouse className='w-8 h-8'/>
                        <span className='text-sm'>Flat</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Rooms")}>
                        <IoBedOutline className='w-8 h-8'/>
                        <span className='text-sm'>Rooms</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("Shops")}>
                        <SiHomeassistantcommunitystore className='w-8 h-8'/>
                        <span className='text-sm'>Shops</span>
                    </div>
                    <div className='flex flex-col items-center cursor-pointer hover:border-b-2' onClick={() => handleCategorySearch("PG")}>
                        <MdBedroomParent className='w-8 h-8'/>
                        <span className='text-sm'>PG</span>
                    </div>
                 
                </div>
            </div>
        </div>
    );
}

export default Navbar;
