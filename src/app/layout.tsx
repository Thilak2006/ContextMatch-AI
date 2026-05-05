import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeMatch — NLP-Powered Resume–Job Matching",
  description:
    "Automated Resume–Job Description Matching System Using Contextual Embeddings and Transformers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
