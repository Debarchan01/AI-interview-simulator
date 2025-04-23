import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex w-full">
        
        {/* Left Side - Sign Up Form */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col items-center justify-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
          <div className="w-full flex-1 mt-8 flex justify-center">
            <SignUp />
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div
          className="hidden lg:flex w-1/2 h-full min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/interview.svg')" }}
        ></div>
      </div>
    </div>
  );
}


