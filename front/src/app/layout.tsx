import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/navbar";
import { ThemeProvider } from "@/components/global/themeProvider";
import { AuthProvider } from "@/components/global/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VertiGo",
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
          <AuthProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
