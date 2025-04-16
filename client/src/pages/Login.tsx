// REVERT POINT - Conversation ID: [Current State]
// This comment marks the current state of the codebase for potential reversion
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Label from '../ui/Label';
import Loading from '../ui/Loading';

const Login = () => {
  const { user, loading: authLoading, signIn } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to profile
  const from = (location.state as { from?: Location })?.from?.pathname || '/profile';
  
  // Add lifecycle logging
  useEffect(() => {
    console.log("[Login] Component mounted/updated");
    console.log("[Login] Initial states:", { user, authLoading, formLoading, from });
    return () => console.log("[Login] Component unmounted");
  }, []);

  // Log state changes
  useEffect(() => {
    console.log("[Login] Auth state changed:", { user, authLoading });
  }, [user, authLoading]);

  useEffect(() => {
    console.log("[Login] Form loading state changed:", { formLoading });
  }, [formLoading]);
  
  // Redirect if already authenticated
  useEffect(() => {
    console.log("[Login] Checking auth state for redirect:", { user, authLoading, from });
    if (user && !authLoading) {
      console.log("[Login] User authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      console.log("[Login] Starting login process...");
      setFormLoading(true);
      setErrMsg("");
      
      const formData = new FormData(e.target);
      const { email, password }: any = Object.fromEntries(formData);
      console.log("[Login] Attempting sign in with email:", email);

      await signIn(email, password);
      console.log("[Login] Sign in successful, waiting for auth state update");
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error("[Login] Login error:", error);
      setErrMsg(error.message);
    } finally {
      console.log("[Login] Login process completed");
      setFormLoading(false);
    }
  };
  
  if (authLoading) {
    console.log("[Login] Rendering auth loading state");
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loading />
        <p className="text-white mt-4">Checking authentication...</p>
      </div>
    );
  }

  if (formLoading) {
    console.log("[Login] Rendering form loading state");
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loading />
        <p className="text-white mt-4">Signing you in...</p>
      </div>
    );
  }
  
  console.log("[Login] Rendering login form");
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-utsaBlue/80 rounded-lg backdrop-blur-sm border border-utsaBlue/30">
        <form
          onSubmit={handleLogin}
          className="max-w-5xl mx-auto pt-10 px-10 lg:px-0 text-white"
        >
          <div className="border-b border-b-white/10 pb-5">
            <h2 className="text-lg font-semibold uppercase leading-7">
              Login Form
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              Enter your email and password to access your account.
            </p>
          </div>
          <div className="border-b border-b-white/10 pb-5">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label title="Email" htmlFor="email" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@(utsa\.edu|my\.utsa\.edu)$"
                  className="block w-full rounded-md border-0 bg-utsaBlue/50 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  placeholder="Enter your UTSA email address"
                />
              </div>
              <div className="sm:col-span-3">
                <Label title="Password" htmlFor="password" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="block w-full rounded-md border-0 bg-utsaBlue/50 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>
          {errMsg && (
            <p className="bg-white/90 text-red-600 text-center py-1 rounded-md tracking-wide font-semibold mt-4">
              {errMsg}
            </p>
          )}
          <button
            disabled={formLoading}
            type="submit"
            className={`mt-5 w-full py-2 uppercase text-base font-bold tracking-wide text-white rounded-md hover:text-white hover:bg-utsaOrange/90 duration-200 ${
              formLoading ? "bg-gray-500 hover:bg-gray-500" : "bg-utsaOrange"
            }`}
          >
            {formLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm leading-6 text-gray-300 text-center -mt-2 py-10">
          Don't have an Account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-gray-200 font-semibold underline underline-offset-2 decoration-[1px] hover:text-white duration-200"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login; 