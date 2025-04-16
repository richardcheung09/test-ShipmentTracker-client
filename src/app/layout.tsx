import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Container } from "@mui/material";
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
  title: "Shipment Tracker",
  description: "Shipment tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <Container maxWidth="lg" sx={{ padding: { xs: 2, sm: 3 } }}>
          {children}
        </Container>
      </body>
    </html>
  );
}
