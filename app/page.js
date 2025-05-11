'use client';  // Mark this file as a client component

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Your main component for Home Page
export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();  // Get auth state from Clerk
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Effect to check if user is signed in and redirect
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Redirect to dashboard if the user is signed in
        router.push("/dashboard");
      } else {
        // Redirect to sign-in page if the user is not signed in
        router.push("/sign-in");
      }
      setLoading(false); // Set loading to false once auth state is determined
    }
  }, [isSignedIn, isLoaded, router]);

  // If the auth state is still loading, show a loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  return null;  // No need to render anything on the home page, as we're handling redirects
}

