"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";


export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSellClick = async () => {
    if (user) {
      router.push("/products/new");
    } else {
      await handleLogin(); // trigger login popup
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 h-25 py-4">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-4xl font-bold text-green-800">
          EcoMarket
        </Link>

        <div className="hidden md:flex gap-6 items-center text-gray-800 text-xl">
          <Link href="/">Home</Link>
          <Link href="/products">Browse</Link>

          {/* Sell Button */}
          <button
            onClick={handleSellClick}
            className="cursor-pointer hover:text-green-600 transition"
          >
            Sell
          </button>

          <Link href="/chat">Chat</Link>
        </div>

        {user ? (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-800">{user.displayName}</span>
              <span className="text-gray-500 text-lg">&#9662;</span> {/* caret */}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition"
          >
            Log In
          </button>
        )}


      </div>
    </nav>
  );
}
