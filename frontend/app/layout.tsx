// app/layout.tsx (Root Layout)
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import Providers from "../components/providers";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "Trade Tracker", // General app title
  description: "Track your trades and improve with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}