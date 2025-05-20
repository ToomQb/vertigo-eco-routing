"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => setLoaded(true), 50);

    // Disable scroll while on this page
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      // Restore scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password != confirmPassword) {
      alert("Password and password confirmation dont match!");
      return;
    }
    if (password.length < 6) {
      alert("Password shall be at leat 6 character long!");
      return;
    }
    (async () => {
      const user = {
        username: email.split("@")[0],
        password: password,
        email: email,
        full_name: email,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (error.detail) alert(error.detail);
        console.error("Signup failed:", error);
      } else {
        const data = await response.json();
        console.log("User created:", data);
        alert("User created!");
      }
    })();

    // logique d'inscription
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
          Sign Up
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
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <div
            className={`transition-transform duration-[1200ms] ease-in-out delay-[600ms]
              ${
                loaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
          >
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            className={`w-full mt-6 flex justify-center items-center gap-2 cursor-pointer bg-dark-green
              transition-transform duration-[1200ms] ease-in-out delay-[800ms]
              ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            <FaUserPlus />
            Sign Up
          </Button>
        </form>

        <div
          className={`mt-6 text-center transition-transform duration-[1200ms] ease-in-out delay-[1000ms]
            ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <span className="text-sm text-gray-600 dark:text-white">
            Already have an account?{" "}
          </span>
          <Link
            href="/login"
            className="text-sm font-medium text-dark-green dark:text-white hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
