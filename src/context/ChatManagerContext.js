// context/ChatManagerContext.jsx
"use client";
import { createContext, useContext, useState } from "react";

const ChatManagerContext = createContext();

export function ChatManagerProvider({ children }) {
  const [openChats, setOpenChats] = useState([]); // each is { chatId, minimized }

  const openChat = (chatId) => {
    setOpenChats((prev) => {
      if (prev.some((c) => c.chatId === chatId)) return prev;
      return [...prev, { chatId, minimized: false }];
    });
  };

  const closeChat = (chatId) => {
    setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
  };

  const toggleMinimize = (chatId) => {
    setOpenChats((prev) =>
      prev.map((c) =>
        c.chatId === chatId ? { ...c, minimized: !c.minimized } : c
      )
    );
  };

  return (
    <ChatManagerContext.Provider
      value={{ openChats, openChat, closeChat, toggleMinimize }}
    >
      {children}
    </ChatManagerContext.Provider>
  );
}

export const useChatManager = () => useContext(ChatManagerContext);
