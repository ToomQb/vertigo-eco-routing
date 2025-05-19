"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaSignInAlt } from 'react-icons/fa';

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
    (async () => {
      console.log("username", email, "password", password)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({email: email, password: password}),
          credentials: "include"
      });

      if (!response.ok) {
          const error = await response.json();
          if (error.detail)
            alert(error.detail)
          console.error("Login failed:", error);
      } else {
          const data = await response.json();
          alert("Login success!")
      }
    })();
    // logique de connexion
  };

  return (
    <div className="bg-light dark:bg-dark-green min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-dark-green -mt-12">
        <h2 className="text-2xl font-medium text-dark-green dark:text-white mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
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

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 text-dark-green dark:text-white cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-gray-600 dark:text-white">Remember me</label>
            </div>
            <Link href="/forgot-password" className="text-sm text-dark-green dark:text-white hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full mt-6 flex justify-center items-center gap-2 cursor-pointer bg-dark-green">
            <FaSignInAlt />
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600 dark:text-white">Don&apos;t have an account? </span>
          <Link href="/signup" className="text-sm font-medium text-dark-green dark:text-white hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
