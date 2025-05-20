"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Animation on mount
    const timer = setTimeout(() => setLoaded(true), 50);

    // Disable scrolling
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      // Restore scrolling when leaving page
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    (async () => {
      console.log("username", email, "password", password);
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (error.detail) alert(error.detail);
        console.error("Login failed:", error);
      } else {
        //const data = await response.json();
        alert("Login success!");
      }
    })();
    // logique de connexion
  };

  return (
    <div className="bg-light dark:bg-dark-green min-h-screen flex justify-center items-center">
      <div
        className={`w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-dark-green -mt-24
          transition-opacity duration-[1200ms] ease-in-out
          ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        <h2
          className={`text-2xl font-medium text-dark-green dark:text-white mb-6 text-center
          transition-transform duration-[1200ms] ease-in-out delay-[0ms]
          ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`transition-transform duration-[1200ms] ease-in-out delay-[200ms]
              ${
                loaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div
            className={`transition-transform duration-[1200ms] ease-in-out delay-[400ms]
              ${
                loaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Password
            </label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-dark-green dark:hover:text-white focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div
            className={`flex justify-between items-center transition-transform duration-[1200ms] ease-in-out delay-[600ms]
              ${
                loaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-dark-green dark:text-white cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 dark:text-white cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-dark-green dark:text-white hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className={`w-full mt-6 flex justify-center items-center gap-2 cursor-pointer bg-dark-green
              transition-transform duration-[1200ms] ease-in-out delay-[800ms]
              ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <FaSignInAlt />
            Sign In
          </Button>
        </form>

        <div
          className={`mt-6 text-center transition-transform duration-[1200ms] ease-in-out delay-[1000ms]
            ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <span className="text-sm text-gray-600 dark:text-white">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/signup"
            className="text-sm font-medium text-dark-green dark:text-white hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
