import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firbase/firbaseConfig.js";

const Login = ({content}) => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User Info:", user);
     window.location.href='/dashboard'
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div>
      <button className=" text-2xl font-bold text-center " onClick={handleGoogleSignIn}>{content}</button>
    </div>
  );
};

export default Login;
