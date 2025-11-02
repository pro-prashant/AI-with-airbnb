
"use client"
import React, { useEffect, useState } from 'react'
import { ListingContext } from '../context/contextlisting'
import axios from 'axios';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';


const ListingProvider = ({children}) => {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [frontendImage1,setFrontendImage1] = useState(null);
    const [frontendImage2,setFrontendImage2] = useState(null);
    const [frontendImage3,setFrontendImage3] = useState(null);
    const [backendImage1, setBackendImage1] = useState(null);
    const [backendImage2, setBackendImage2] = useState(null);
    const [backendImage3, setBackendImage3] = useState(null);
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [landMark, setLandMark] = useState("");
    const [categorey, setCategorey] = useState("");
    const [createListing,setCreateListing] = useState(null);
    const [listing,setListing] = useState([]);
    const [showData,setShowData] = useState([]);
    const [cardDetails,setCardDetails] = useState();
    const [listingSearch,setlistingSearch] = useState([]);
    const [loading ,setLoading] = useState(false);
const handleCreateListing = async () => {
  try {
              setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("landMark", landMark);
    formData.append("categorey", categorey);
    if (backendImage1) formData.append("image1", backendImage1);
    if (backendImage2) formData.append("image2", backendImage2);
    if (backendImage3) formData.append("image3", backendImage3);

    const response = await axios.post("/api/listing/createListing", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
       console.log("Response:", response.data);
    setCreateListing(response.data);
      setLoading(false);
  } catch (error) {
    console.error("Create listing error:", error.response?.data || error.message);
  }
};

 
const handleGetLiting = async () => {
  try {
    const response = await axios.get("/api/listing/getListing", {
      withCredentials: true,
    });

    const result = response.data.listing;
    console.log(result);
    setListing(result);
    setShowData(result);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
};

const handleViewCard = async (id) => {
  try {
    const response = await axios.get(`/api/listing/findById/${id}`, {
      withCredentials: true,
    });
    const result = response.data;
    console.log(result);
    setCardDetails(result);
  } catch (error) {
    console.error("Error from API:", error);
  }
};
 
const handleListingSearch = async (query = "") => {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    setlistingSearch([]);
    return;
  }

  console.log("Calling Query:", cleanQuery);

  try {
    const response = await axios.get(
      `/api/listing/listingsearch?query=${encodeURIComponent(cleanQuery)}`,
      { withCredentials: true }
    );

    const result = response.data;

    if (result?.success) {
      setlistingSearch(result.listing);
    } else {
      console.warn("Search failed or no results found.");
      setlistingSearch([]);
    }
  } catch (error) {
    console.error("Search error:", error);
    setlistingSearch([]);
  }
};



  useEffect(()=>{
        handleGetLiting();
  },[])


    const value = {
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
           landMark,setLandMark,
           categorey,setCategorey,
           handleCreateListing,
           listing,setListing,
           showData,setShowData,
           loading ,setLoading,
           handleViewCard,
           cardDetails,setCardDetails,
           listingSearch,setlistingSearch,
           handleListingSearch,
    }


   
  return (
     <ListingContext.Provider value={value}>
       {children}
   </ListingContext.Provider>
  )
}

export default ListingProvider
