"use client";

import { useChatManager } from "../../context/ChatManagerContext";
import ChatBox from "./ChatBox"; // ✅ your floating chat UI

export default function ChatBoxes() {
  const { openChats, closeChat, toggleMinimize } = useChatManager();

  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-50">
      {openChats.map(({ chatId, minimized }) => (
        <ChatBox
          key={chatId}
          chatId={chatId}
          minimized={minimized}
          onClose={() => closeChat(chatId)}
          onToggleMinimize={() => toggleMinimize(chatId)}
        />
      ))}
    </div>
  );
}
