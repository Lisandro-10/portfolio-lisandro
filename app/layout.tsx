import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lisandro Andia | Ingeniero en Sistemas",
  description: "Portfolio profesional de Lisandro Andia - Ingeniero en Sistemas, especializado en desarrollo de aplicaciones web Next.js y spring boot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-dark text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
