import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "TEMPO VALIDATOR DASHBOARD | HEDGEQUANTX",
  description:
    "REAL-TIME VALIDATOR MONITORING FOR THE TEMPO NETWORK. BUILT BY HEDGEQUANTX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.variable} antialiased uppercase`}>
        {children}
      </body>
    </html>
  );
}
