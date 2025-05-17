"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);

    // Disable scroll when page is mounted
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      // Re-enable scroll on unmount
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center bg-light dark:bg-dark-green min-h-screen">
      <div
        className={`w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-dark-green -mt-24
          transition-opacity duration-[1200ms] ease-in-out
          ${loaded ? "opacity-100" : "opacity-0"}
          transition-transform duration-[1200ms] ease-in-out
          ${loaded ? "translate-y-0" : "translate-y-6"}`}
      >
        <h1 className="text-2xl font-medium text-dark-green dark:text-white text-center">
          Don&apos;t ask for support please
        </h1>
      </div>
    </main>
  );
}
