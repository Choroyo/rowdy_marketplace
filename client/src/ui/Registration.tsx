// src/ui/Registration.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Label from "./Label";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [registrationAttempted, setRegistrationAttempted] = useState(false);
  const navigate = useNavigate();
  
  const { user, signUp } = useAuth();
  
  // Add lifecycle logging
  useEffect(() => {
    console.log("[Registration] Component mounted/updated");
    console.log("[Registration] Initial states:", { loading, registrationAttempted, user });
    return () => console.log("[Registration] Component unmounted");
  }, []);

  // Log state changes
  useEffect(() => {
    console.log("[Registration] Loading state changed:", { loading });
  }, [loading]);

  useEffect(() => {
    console.log("[Registration] User state changed:", { user });
    // If user becomes authenticated, redirect to profile
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);
  
  const handleRegistration = async (e: any) => {
    e.preventDefault();
    setErrMsg("");
    
    const formData = new FormData(e.target);
    const formEntries = Object.fromEntries(formData);
    const firstName = formEntries.firstName as string;
    const lastName = formEntries.lastName as string;
    const email = formEntries.email as string;
    const password = formEntries.password as string;
    
    try {
      console.log("[Registration] Starting registration process...");
      setLoading(true);
      setRegistrationAttempted(true);
      console.log("[Registration] Form data:", { email, firstName, lastName });
      
      await signUp(email, password, firstName, lastName);
      console.log("[Registration] Registration successful");
      
      // Auth state change will trigger redirect in useEffect
    } catch (error: any) {
      console.error("[Registration] Registration error:", error);
      setErrMsg(error.message || "Registration failed. Please try again.");
    } finally {
      console.log("[Registration] Setting loading state to false");
      setLoading(false);
    }
  };
  
  if (loading) {
    console.log("[Registration] Rendering loading state");
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loading />
        <p className="text-white mt-4">Processing your registration...</p>
      </div>
    );
  }
  
  console.log("[Registration] Rendering registration form");
  return (
    <div className="bg-utsaBlue/80 rounded-lg p-8 backdrop-blur-sm border border-utsaBlue/30">
      <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
      
      {errMsg && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-md mb-6">
          {errMsg}
        </div>
      )}
      
      <form onSubmit={handleRegistration} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label title="First Name" htmlFor="firstName" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full mt-2 px-3 py-2 bg-utsaBlue/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-skyText border border-white/10"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <Label title="Last Name" htmlFor="lastName" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full mt-2 px-3 py-2 bg-utsaBlue/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-skyText border border-white/10"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div>
          <Label title="Email (use your @utsa email)" htmlFor="email" />
          <input
            type="email"
            id="email"
            name="email"
            required
            pattern="^[a-zA-Z0-9._%+-]+@(utsa\.edu|my\.utsa\.edu)$"
            className="w-full mt-2 px-3 py-2 bg-utsaBlue/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-skyText border border-white/10"
            placeholder="Enter your UTSA email address"
          />
        </div>
        
        <div>
          <Label title="Password" htmlFor="password" />
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full mt-2 px-3 py-2 bg-utsaBlue/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-skyText border border-white/10"
            placeholder="Enter your password"
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 uppercase text-base font-bold tracking-wide text-white rounded-md hover:text-white hover:bg-utsaOrange/90 duration-200 ${
            loading ? "bg-gray-500 hover:bg-gray-500" : "bg-utsaOrange"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      
      <p className="text-sm leading-6 text-gray-300 text-center mt-6">
        Already have an Account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-gray-200 font-semibold underline underline-offset-2 decoration-[1px] hover:text-white duration-200"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Registration;