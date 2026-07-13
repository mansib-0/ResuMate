import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResuMate | AI-Powered Resume Tailor",
  description: "Instantly tailor your resume and track job applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
