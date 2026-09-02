import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata: Metadata = {
  title: "ResuMate | AI-Powered Resume Tailor",
  description: "Instantly tailor your resume and track job applications.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="app-container">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
