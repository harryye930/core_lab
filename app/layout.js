import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Core Lab",
  description: "Computing education research at the University of Toronto and partner institutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} min-h-screen bg-white text-slate-900 antialiased`}
      >
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
