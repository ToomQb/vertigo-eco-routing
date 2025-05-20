"use client";

import React from "react";
import { FaUser, FaHeart, FaCar, FaCog, FaQuestionCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/global/authContext";

const HeaderOnlyLayout = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="bg-light dark:bg-dark-green flex flex-col w-screen sticky top-0 z-50">
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
          <AvatarButton isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        </div>
      </header>
    </div>
  );
};

const CompanyLogoLink = () => {
  return (
    <Link href="/" className="flex items-center gap-2 px-3 h-[40px]">
      <img src="/logo.png" alt="VertiGo Logo" className="h-35 object-contain" />
    </Link>
  );
};

export default HeaderOnlyLayout;

type AvatarButtonProps = {
  isLoggedIn: boolean;
  user?: { name: string; email: string } | null;
  onLogout: () => void;
};

const AvatarButton = ({ isLoggedIn, user, onLogout }: AvatarButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-green cursor-pointer">
          <Avatar>
            {isLoggedIn ? (
              <img
                src="/user.jpg"
                alt={user?.name ?? "User"}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback>
                <FaUser size={24} />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-[9999] w-48 absolute top-full mt-2 right-0 transform translate-x-[-50%] md:translate-x-0"
      >
        {!isLoggedIn ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">Guest</div>
                <div className="text-muted-foreground text-sm font-normal">Sign in for more</div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href="/login">
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
                <div className="flex justify-between items-center">{user?.name ?? "User"}</div>
                <div className="text-muted-foreground text-sm font-normal">{user?.email ?? "user@example.com"}</div>
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
            <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
              <FaSignOutAlt className="mr-2" size={18} /> Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
