// app/layout.tsx (Root Layout)
import "./globals.css";
import { Inter } from "next/font/google";
// You might move ThemeProvider here if it's truly global, or keep it in (main)/layout.tsx
// import { ThemeProvider } from "@/components/theme-provider"; 

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {/* If ThemeProvider is here: */}
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
          {children} {/* This will render (auth)/layout.tsx or (main)/layout.tsx */}
        {/* </ThemeProvider> */}
        {/* If ThemeProvider is not here, (main)/layout.tsx will handle it for its routes */}
      </body>
    </html>
  );
}