"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { auth, provider, db } from "../../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";




export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();


  const [dropdownOpen, setDropdownOpen] = useState(false);



  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store or update user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      }, { merge: true }); // merge = keep existing data

      router.push("/");
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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User:", user);

        // setUser(user);  // user.photoURL will be valid
      } else {
        // setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const NavLink = ({ href, label }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`px-2 py-1 rounded transition duration-150 ${isActive
          ? "text-green-800 font-semibold border-b-2 border-green-800"
          : "text-gray-800 hover:text-green-600"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 h-25 py-4">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-4xl font-bold text-green-800">
            EcoMarket
          </Link>

          {user &&
            <div className="hidden md:flex gap-6 items-center text-gray-800 text-xl">
              {/* <NavLink href="/" label="Home" /> */}
              <NavLink href="/products" label="Browse" />
              <NavLink href="/products/new" label="Sell" />
              <NavLink href="/chat" label="Chat" />
              <NavLink href="/profile" label="Profile" />

            </div>
          }

        </div>


        {user ? (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user?.photoURL && (
                <div className="w-10 h-10 overflow-hidden rounded-full">
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <span className="text-xl text-gray-800">{user.displayName}</span>
            </div>


          </div>
        ) : (
          <NavLink href="/login" label="Login" />

        )}


      </div>
    </nav>
  );
}
