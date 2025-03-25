import { Button } from "@components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MonSite
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/about">
              <Button variant="ghost" className="hover:text-gray-400">
                About
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <Button variant="ghost" className="hover:text-gray-400">
                Contact
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
