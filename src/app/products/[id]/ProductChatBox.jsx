"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProductChatBox({ productId }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!productId) return;

    const q = query(
      collection(db, "productChats", productId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [productId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    await addDoc(collection(db, "productChats", productId, "messages"), {
      text: input,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  if (!user) return null; // don't render if not logged in

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md border rounded-md shadow-lg bg-white z-50">
      <div className="p-3 border-b bg-green-700 text-white rounded-t-md">
        Product Chat
      </div>
      <div className="p-3 max-h-64 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.senderId === user.uid
                ? "bg-green-100 self-end text-right ml-auto"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center p-3 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-md"
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
  );
}
