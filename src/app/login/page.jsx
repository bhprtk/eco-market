"use client";

import { auth, provider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
	const router = useRouter();

	const handleLogin = async () => {
		try {
			await signInWithPopup(auth, provider);
			router.push("/");
		} catch (err) {
			console.error("Login error:", err);
		}
	};

	useEffect(() => {
		const unsub = auth.onAuthStateChanged((user) => {
			if (user) router.push("/");
		});
		return () => unsub();
	}, []);

	return (
		<div className="min-h-screen bg-green-50">
			<main className=" text-center flex flex-col items-center min-h-[80vh] justify-center px-4">
				<h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">EcoMarket</h1>
				<p className="text-gray-700 text-lg mb-8 max-w-md">
					Join the movement. Log in to discover and support sustainable, ethical, and eco-conscious products.
				</p>
				<button
					onClick={handleLogin}
					className="bg-green-700 hover:bg-green-600 text-white text-lg px-6 py-3 rounded cursor-pointer transition"
				>
					Sign in with Google
				</button>
			</main>

		</div>
	);
}
