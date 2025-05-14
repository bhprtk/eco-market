"use client";

import { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function ChatBox({ chatId }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(
      collection(db, "messages", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "messages", chatId, "messages"), {
      text: input,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-700 text-white px-4 py-2 rounded-md shadow"
      >
        {open ? "Close Chat" : "Chat"}
      </button>

      {open && (
        <div className="bg-white border mt-2 rounded shadow-lg flex flex-col h-96">
          <div className="flex-1 overflow-y-auto p-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`my-1 p-2 rounded-md max-w-[70%] ${
                  msg.senderId === user?.uid ? "bg-green-100 self-end" : "bg-gray-100 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-2 py-1 rounded"
              placeholder="Message..."
            />
            <button
              type="submit"
              className="ml-2 px-4 py-1 bg-green-700 text-white rounded"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
