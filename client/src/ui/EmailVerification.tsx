// src/ui/EmailVerification.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, reload } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

type TimerType = ReturnType<typeof setInterval>;

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in or already verified
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.emailVerified) {
      navigate("/profile");
    }
  }, [user, navigate]);
  
  // Countdown timer for resend button
  useEffect(() => {
    let interval: TimerType | undefined;
    
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendDisabled, timer]);
  
  // Resend verification email
  const handleResendEmail = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await sendEmailVerification(user);
      setMessage("Verification email resent! Check your inbox.");
      setResendDisabled(true);
      setTimer(60);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has verified their email
  const handleCheckVerification = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await reload(user);
      
      if (user.emailVerified) {
        navigate("/profile");
      } else {
        setMessage("Your email is not verified yet. Please check your inbox.");
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Log the user out
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };
  
  if (loading) return <Loading />;
  
  return (
    <div className="bg-gray-950 rounded-lg p-8 max-w-md mx-auto my-10 text-white">
      <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
      <p className="text-gray-300 mb-6">
        Please verify your email address to continue. Check your inbox for a verification link.
      </p>
      
      {message && (
        <div className={`p-4 rounded-md mb-4 ${
          message.startsWith('Error') 
            ? 'bg-red-900/50 text-red-200' 
            : 'bg-green-900/50 text-green-200'
        }`}>
          {message}
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={handleCheckVerification}
          className="w-full bg-indigo-700 py-2 rounded-md hover:bg-indigo-600 transition-colors"
        >
          I've Verified My Email
        </button>
        
        <button
          onClick={handleResendEmail}
          disabled={resendDisabled}
          className={`w-full py-2 rounded-md transition-colors ${
            resendDisabled
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-indigo-700 hover:bg-indigo-600'
          }`}
        >
          {resendDisabled 
            ? `Resend Email (${timer}s)` 
            : 'Resend Verification Email'
          }
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full bg-red-700 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;