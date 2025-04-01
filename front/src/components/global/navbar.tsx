"use client";

import React from "react";
import { FaUser } from 'react-icons/fa'; 
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

const HeaderOnlyLayout = () => {
  return (
    <div className="bg-white dark:bg-dark-green flex flex-col w-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-6 z-50 relative border-b border-dark-green border-b-2">
        <div className="flex items-center gap-8">
          <CompanyLogoLink />
          <Link href="/about" className="font-medium text-lg text-gray-800 hover:text-dark-green active:text-dark-green visited:text-gray-800 dark:text-white dark:hover:text-dark-green dark:active:text-dark-green dark:visited:text-white">
            About
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <AvatarButton />
        </div>
      </header>
    </div>
  );
};

export default HeaderOnlyLayout;

const CompanyLogoLink = () => {
  return (
    <Link href="#" className="flex items-center gap-2 px-3">
      <h1 className="font-medium text-lg text-dark-green dark:text-white">Nom projet</h1>
    </Link>
  );
};

const AvatarButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-green">
          <Avatar>
            <AvatarFallback>
              <FaUser size={24} />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      {/* Dropdown content with right-aligned and adjusted positioning */}
      <DropdownMenuContent 
        align="end" 
        className="z-[9999] w-48 absolute top-full mt-2 right-0 transform translate-x-[-50%] md:translate-x-0"
      >
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
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
