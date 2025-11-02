"use client";
import React, { useState, useEffect, useCallback } from "react";
import { UserAuthContext } from "../context/contextauth";
import axios from "axios";

const UserAuthProvider = ({ children }) => {
  /* ---------- local state ---------- */
  const [signup,   setSignup]   = useState(null);
  const [login,    setLogin]    = useState(null);
  const [userInfo, setUserInfo] = useState(null);   // null until fetched
  const [loading,  setLoading]  = useState(false);  // handy flag
  const [userProfile,setUserProfile] = useState(null);

  /* ---------- helper: fetch profile ---------- */
  async function fetchUserInfo() {
  try {
   
    const res = await axios.get("/api/auth/userInfo", {
      withCredentials: true,
    });

    console.log("📡 /api/auth/userInfo →", res.data);

    const user = res.data?.user ?? null;
    setUserInfo(user);

    const profile =
      user?.name?.trim?.().charAt?.(0)?.toUpperCase?.() ?? "";
    setUserProfile(profile);
  } catch (err) {
    console.error("UserInfo error:", err.response?.data || err.message);
    setUserInfo(null);
  } 
}

  /* ---------- signup ---------- */
  const handleSignup = async (payload) => {
    const { data } = await axios.post("/api/auth/signup", payload, {
      withCredentials: true,
    });
    setSignup(data);
    return data;
  };

  /* ---------- login ---------- */
  const handleLogin = async (payload) => {
    const { data } = await axios.post("/api/auth/login", payload, {
      withCredentials: true,
    });
    setLogin(data);
    await fetchUserInfo();        // 🚀 immediately pull profile
    return data;
  };

  /* ---------- auto‑fetch profile on first load ---------- */
  useEffect(() => {
    fetchUserInfo();
  }, []);

  /* ---------- context value ---------- */
  const value = {
    signup,
    setSignup,
    login,
    setLogin,
    userInfo,
    setUserInfo,
    loading,
    handleSignup,
    handleLogin,
    fetchUserInfo,
    userProfile,
    setUserProfile,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthProvider;
