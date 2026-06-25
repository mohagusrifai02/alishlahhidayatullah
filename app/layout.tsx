import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yayasan Al-Ishlah Hidayatullah",
  description: "Official website of Yayasan Al-Ishlah Hidayatullah Kabupaten Tegal",
  icons:{
    icon: "/logo.ico"
  },
  openGraph:{
    title:"Yayasan Al-Ishlah",
    description:"Official Website Yayasan Al-Ishlah Hidayatullah Kabupaten Tegal",
    url:"https://www.alishlahtegal.net/",
    siteName:"Yayasan Al-Ishlah",
    images:[
      {
        url:'https://www.alishlahtegal.net/logo.jpeg',
        width:800,
        height:600,
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
