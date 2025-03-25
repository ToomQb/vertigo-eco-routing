import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Image src="/next.svg" alt="Logo" width={40} height={40} />
        <span className="text-lg font-semibold">Mon Projet</span>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="text-gray-700 hover:text-black">Accueil</Link>
        </li>
        <li>
          <Link href="/about" className="text-gray-700 hover:text-black">À propos</Link>
        </li>
        <li>
          <Link href="/contact" className="text-gray-700 hover:text-black">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
