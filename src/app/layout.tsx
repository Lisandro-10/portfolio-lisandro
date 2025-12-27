import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lisandro Andia | Ingeniero en Sistemas",
  description: "Portfolio profesional de Lisandro Andia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${inter.className} bg-dark text-white antialiased flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}