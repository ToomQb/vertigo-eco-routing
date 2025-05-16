"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaUserPlus } from 'react-icons/fa';

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // logique d'inscription
  };

  return (
    <div className="bg-light dark:bg-dark-green min-h-screen flex justify-center items-center">
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-dark-green -mt-12">
      <h2 className="text-2xl font-medium text-dark-green dark:text-white mb-6 text-center">
          Sign Up
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-white">
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

          <Button type="submit" className="w-full mt-6 flex justify-center items-center gap-2 cursor-pointer bg-dark-green">
            <FaUserPlus />
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600 dark:text-white">Already have an account? </span>
          <Link href="/login" className="text-sm font-medium text-dark-green dark:text-white hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
