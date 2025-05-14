"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db, auth } from "../../lib/firebase";
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from "firebase/firestore";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";



export default function ProfilePage() {
	const { user } = useAuth();
	const [userData, setUserData] = useState(null);
	const [listings, setListings] = useState([]);
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push("/"); // ✅ Redirect to home

		} catch (err) {
			console.error("Logout error:", err);
		}
	};
	useEffect(() => {
		if (!user) return;

		const fetchUserProfile = async () => {
			const userRef = doc(db, "users", user.uid);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				setUserData(userSnap.data());
			}
		};

		const fetchUserListings = async () => {
			const q = query(collection(db, "products"), where("sellerId", "==", user.uid));
			const querySnapshot = await getDocs(q);
			const listingsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setListings(listingsData);
		};

		fetchUserProfile();
		fetchUserListings();
	}, [user]);

	if (!user) return <p>Please log in to view your profile.</p>;

	return (
		<main className="max-w-4xl mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold mb-6">Your Profile</h1>
			<div className="flex justify-between items-start mb-16">

				<div>

					{userData && (
						<div className="p-4 rounded-md">
							<div className="flex items-center gap-4">
								{userData.photoURL && (
									<img
										src={userData.photoURL}
										alt="Profile"
										className="w-16 h-16 rounded-full object-cover"
									/>
								)}
								<div>
									<p className="text-xl font-semibold">{userData.name || "Anonymous"}</p>
									<p className="text-gray-600">{user.email}</p>
								</div>
							</div>
						</div>
					)}

				</div>
				<div className="flex item-center">
					<button
						onClick={handleLogout}
						className="cursor-pointer text-sm px-4 py-2 mt-6 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
					>
						Logout
					</button>

				</div>
			</div>

			<h2 className="text-2xl font-semibold mb-4">Your Listings</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{listings.map((product) => (
					<Link href={`/products/${product.id}`} key={product.id}>

						<div key={product.id} className="rounded-md p-4">
							<img
								src={product.imageUrl}
								alt={product.title}
								className="w-full h-64 object-contain rounded mb-2"
							/>
							<h2 className="text-2xl font-semibold mt-4">{product.title}</h2>
							<p className="text-2xl mt-2">${product.price.toFixed(2)}</p>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
