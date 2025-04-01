import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/navbar";
import { ThemeProvider } from "@/components/global/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Create with React and Shadcn UI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`h-screen w-screen flex flex-col ${geistSans.className}`}>
        <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem={false} 
            disableTransitionOnChange
          >
          <Navbar />
          <div className="flex-1">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}