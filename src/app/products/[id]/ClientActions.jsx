"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getOrCreateChat } from "../../../lib/chatUtils";

export default function ClientActions({
  sellerId,
  productId,
}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const isOwner = user?.uid === sellerId;

  const handleChatClick = async () => {
    if (!user) {
      router.push("/login");
    } else {
      const chatId = await getOrCreateChat(user.uid, sellerId, productId);
      router.push(`/chat/${chatId}`);
    }
  };


  return (
    <div className="mt-6">
      {isOwner ? (
        <button
          onClick={() => router.push(`/products/${productId}/edit`)}
          className="border border-green-700 text-green-700 px-6 py-3 rounded-md hover:bg-green-700 hover:text-white transition cursor-pointer"
        >
          Edit Product
        </button>
      ) : (
        <button
          onClick={handleChatClick}
          className="border border-green-700 text-green-700 px-6 py-3 rounded-md hover:bg-green-700 hover:text-white transition cursor-pointer"
        >
          Start Chat
        </button>
      )}
    </div>
  );

}
