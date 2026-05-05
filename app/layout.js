import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminShortcutConsole from "@/components/AdminShortcutConsole";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Yaksh Patel",
  description: "Yaksh Patel — portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex-1 pt-24 md:pt-28">{children}</div>
        <Footer />
        <AdminShortcutConsole />
      </body>
    </html>
  );
}
