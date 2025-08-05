import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AI Match - Find Your AI Personality",
  description: "Discover which AI model matches your personality with this fun quiz!",
  openGraph: {
    title: "AI Match: Find Your AI Vibe",
    description: "Take a fun quiz to discover your AI personality and share your vibe on Farcaster!",
    url: "https://ai-match-psi.vercel.app",
    siteName: "AI Match",
    images: [
      {
        url: "https://ai-match-psi.vercel.app/images/promo.png",
        width: 1200,
        height: 630,
        alt: "AI Match - Find Your AI Personality",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Match: Find Your AI Vibe",
    description: "Take a fun quiz to discover your AI personality and share your vibe on Farcaster!",
    images: ["https://ai-match-psi.vercel.app/images/promo.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
