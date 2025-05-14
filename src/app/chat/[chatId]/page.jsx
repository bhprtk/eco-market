"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ProductTabs from "@/app/products/[id]/ProductTabs";

export default function ChatPage() {
  const { chatId } = useParams();
  const router = useRouter();
  const { user, authReady } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [product, setProduct] = useState(null);
  const [chatExists, setChatExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const checkChat = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists()) {
        setChatExists(true);
        const q = query(
          collection(db, "chats", chatId, "messages"),
          orderBy("timestamp", "asc")
        );
        onSnapshot(q, (snapshot) => {
          setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        // Also load product
        const data = chatDoc.data();
        if (data.productId) {
          const productDoc = await getDoc(doc(db, "products", data.productId));
          if (productDoc.exists()) {
            setProduct(productDoc.data());
          }
        }
      }
      setLoading(false);
    };

    checkChat();
  }, [authReady, user, chatId, router]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const chatDocRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatDocRef);

    // If the chat doesn't exist yet, create it after ensuring product is loaded
    if (!chatDoc.exists()) {
      const productDoc = await getDoc(doc(db, "products", chatId));
      if (!productDoc.exists()) {
        console.error("Product not found. Cannot create chat.");
        return;
      }

      const productData = productDoc.data();
      setProduct(productData); // update local state too if needed

      await setDoc(chatDocRef, {
        buyerId: user.uid,
        sellerId: productData.sellerId,
        productId: chatId,
        lastMessage: input,
        lastUpdated: serverTimestamp(),
      });

      setChatExists(true);
    } else {
      // If chat already exists, just update metadata
      await updateDoc(chatDocRef, {
        lastMessage: input,
        lastSenderId: user.uid,
        lastUpdated: serverTimestamp(),
      });
    }

    // Add the message
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input,
      senderId: user.uid,
      senderName: user.displayName || "Anonymous",
      senderPhotoURL: user.photoURL || "",
      timestamp: serverTimestamp(),
    });

    setInput("");
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-[80vh pt-10">
        {/* Left: Product Info */}
        <div className="overflow-y-auto pr-4 border-r border-gray-300">
          {product ? (
            <>
              <h1 className="text-4xl mb-2">{product.title}</h1>
              <p className="text-5xl font-semibold py-6">
                ${parseFloat(product.price).toFixed(2)}
              </p>
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-md w-full max-w-md object-cover mb-4"
              />
            </>
          ) : (
            <p>Loading product info...</p>
          )}
        </div>

        {/* Right: Chat */}
        <div className="flex flex-col pl-4">
          <div className="h-[65vh] overflow-y-auto mb-4 space-y-3 pr-4 rounded-md p-4">
            {chatExists && messages.map((msg) => {
              const isUser = msg.senderId === user?.uid;
              const alignment = isUser ? "items-end text-right" : "items-start text-left";
              const bubbleColor = isUser ? "bg-green-100" : "bg-gray-100";

              return (
                <div key={msg.id} className={`flex flex-col ${alignment}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isUser && (
                      <img
                        src={msg.senderPhotoURL}
                        alt="avatar"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-xs text-gray-500 font-medium">
                      {msg.senderName || (isUser ? "You" : "User")}
                    </span>
                  </div>
                  <div className={`${bubbleColor} text-gray-800 px-4 py-2 rounded-lg max-w-[70%]`}>
                    {msg.text}
                  </div>
                  {msg.timestamp?.toDate && (
                    <div className="text-right text-[10px] text-gray-400 mt-1">
                      {new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {/* <div ref={bottomRef} /> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-4 py-2 rounded-md"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="border border-green-700 text-green-700 px-4 py-2 rounded-md hover:bg-green-700 hover:text-white transition cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {product && <ProductTabs product={product} />}
    </div>
  );
}
