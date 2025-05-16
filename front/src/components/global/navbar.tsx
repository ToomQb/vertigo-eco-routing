"use client";

import React from "react";
import { FaUser, FaHeart, FaCar, FaCog, FaQuestionCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; 
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

const HeaderOnlyLayout = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white dark:bg-dark-green flex flex-col w-screen">
      <header className="flex justify-between items-center px-6 py-6 z-50 relative border-b border-dark-green border-b-2">
        <div className="flex items-center gap-8">
          <CompanyLogoLink />
          <nav className="flex items-center gap-6 h-[40px]">
            <Link
              href="/about"
              className={`font-medium text-lg leading-none flex items-center px-2 h-full ${
                pathname === "/about"
                  ? "border-b-2 border-dark-green"
                  : "text-gray-800 hover:text-dark-green active:text-dark-green visited:text-gray-800 dark:text-white dark:hover:text-dark-green dark:active:text-dark-green dark:visited:text-white"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <AvatarButton isLoggedIn={false} />
        </div>
      </header>
    </div>
  );
};

const CompanyLogoLink = () => {
  return (
    <Link href="/" className="flex items-center gap-2 px-3 h-[40px]">
      <span className="font-medium text-lg leading-none text-dark-green dark:text-white flex items-center h-full">
        EcoRoute
      </span>
    </Link>
  );
};

export default HeaderOnlyLayout;

const AvatarButton = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-green cursor-pointer">
          <Avatar>
            <AvatarFallback>
              <FaUser size={24} />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown content for logged-out user */}
      <DropdownMenuContent 
        align="end" 
        className="z-[9999] w-48 absolute top-full mt-2 right-0 transform translate-x-[-50%] md:translate-x-0"
      >
        {!isLoggedIn ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  Guest
                </div>
                <div className="text-muted-foreground text-sm font-normal">
                  Sign in for more
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href="/login" >
              <DropdownMenuItem className="cursor-pointer">
                <FaSignInAlt className="mr-2" size={18} /> Login
              </DropdownMenuItem>
            </Link>
            <Link href="/signup">
              <DropdownMenuItem className="cursor-pointer">
                <FaUserPlus className="mr-2" size={18} /> Sign Up
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href="/support">
              <DropdownMenuItem className="cursor-pointer">
                <FaQuestionCircle className="mr-2" size={18} /> Support
              </DropdownMenuItem>
            </Link>
          </>
        ) : (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  John Doe
                </div>
                <div className="text-muted-foreground text-sm font-normal">
                  john.doe@gmail.com
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href="/saved-trips">
              <DropdownMenuItem className="cursor-pointer">
                <FaHeart className="mr-2" size={18} /> Saved Trips
              </DropdownMenuItem>
            </Link>
            <Link href="/vehicles">
              <DropdownMenuItem className="cursor-pointer">
                <FaCar className="mr-2" size={18} /> Vehicles
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer">
                <FaCog className="mr-2" size={18} /> Settings
              </DropdownMenuItem>
            </Link>
            <Link href="/support">
              <DropdownMenuItem className="cursor-pointer">
                <FaQuestionCircle className="mr-2" size={18} /> Support
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href="/logout">
              <DropdownMenuItem className="cursor-pointer">
                <FaSignOutAlt className="mr-2" size={18} /> Logout
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
