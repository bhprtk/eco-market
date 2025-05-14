"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function ChatListPage() {
  const { user, authReady } = useAuth();
  const router = useRouter();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!authReady) return;
    if (!user) router.push("/login");
  }, [authReady, user, router]);

  useEffect(() => {
    if (!user) return;

    const qBuyer = query(collection(db, "chats"), where("buyerId", "==", user.uid));
    const qSeller = query(collection(db, "chats"), where("sellerId", "==", user.uid));

    const handleSnapshots = async () => {
      const allDocs = [];

      const buyerSnapshot = await getDocs(qBuyer);
      const sellerSnapshot = await getDocs(qSeller);

      buyerSnapshot.forEach((doc) => allDocs.push(doc));
      sellerSnapshot.forEach((doc) => allDocs.push(doc));

      const chatData = await Promise.all(
        allDocs.map(async (docSnap) => {
          const data = docSnap.data();
          if (!data.lastMessage) return null;

          const productRef = doc(db, "products", data.productId);
          const productSnap = await getDoc(productRef);
          const product = productSnap.exists() ? productSnap.data() : null;

          const otherUserId = user.uid === data.buyerId ? data.sellerId : data.buyerId;
          const userRef = doc(db, "users", otherUserId);
          const userSnap = await getDoc(userRef);
          const otherUser = userSnap.exists() ? userSnap.data() : null;

          return {
            id: docSnap.id,
            ...data,
            product,
            otherUser,
          };
        })
      );

      const uniqueChats = chatData.filter(Boolean); // Remove nulls
      setChats(uniqueChats);
    };

    handleSnapshots();
  }, [user]);


  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>
      {chats.length === 0 ? (
        <p>No chats yet.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li key={chat.id} className="p-4 rounded-md flex items-center gap-4">
              {chat.product?.imageUrl && (
                <img
                  src={chat.product.imageUrl}
                  alt={chat.product.title}
                  className="w-42 h-42 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <Link
                  href={`/chat/${chat.id}`}
                  className="flex items-start gap-4 hover:bg-gray-50 p-4 rounded-md transition"
                >


                  {/* Chat Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-2xl text-gray-800">{chat.product?.title || "Untitled Product"}</p>
                    </div>

                    <div className="flex items-start gap-4 w-full">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={chat.otherUser?.photoURL}
                          alt={chat.otherUser?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text Info */}
                      <div className="flex-1">
                        {/* Name */}
                        <p className="text-lg text-gray-800">
                          {chat.otherUser?.name || "Unknown User"}
                        </p>

                        {/* Message + Time */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
                          <p className="italic truncate max-w-full md:max-w-[250px]">
                            {(chat.lastSenderId === user?.uid ? "You: " : "") + (chat.lastMessage || "No messages yet.")}
                          </p>
                          {chat.lastUpdated?.toDate && (
                            <span className="text-xs text-gray-400 mt-1 md:mt-0 md:ml-4">
                              {chat.lastUpdated.toDate().toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>



                  </div>
                </Link>

              </div>

            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
