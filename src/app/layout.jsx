import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { ChatManagerProvider } from "../context/ChatManagerContext"; // ✅ import
import ChatBoxes from "./components/ChatBoxes"; // ✅ render all open chat windows

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChatManagerProvider>
            <Navbar />
            {children}
            <ChatBoxes /> {/* ✅ floating boxes anchored here */}
          </ChatManagerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
