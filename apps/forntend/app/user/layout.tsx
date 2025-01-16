import type { Metadata } from "next";
import localFont from "next/font/local";
import MainNevbar from "../components/MainNevbar";
import Notification from "../components/Notification";
import Fetchdata from '../components/FetchData'; // Ensure correct path and casing


const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff", 
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your expenses and friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body
      
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
          <MainNevbar />
          <Notification/>
          <Fetchdata/>
          
      </body>
    </html>     
  );
}
