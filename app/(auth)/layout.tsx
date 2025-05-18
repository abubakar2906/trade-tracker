// app/(auth)/layout.tsx
// This layout applies ONLY to routes within the (auth) group, like /login and /signup

import { ThemeProvider } from "@/components/theme-provider";

// You might still want ThemeProvider or other global contexts here if needed
// For simplicity, let's assume it's just the children for now.
// If you have a global ThemeProvider in your root layout, it will still apply
// unless you explicitly override it or don't include it here.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // You might want a specific wrapper div for auth pages, or just render children
    // For example, to ensure they take full screen height for centering:
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>

    <div className="min-h-screen flex flex-col"> 
      {children}
    </div>

    </ThemeProvider>
  );
}