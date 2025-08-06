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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="fc:miniapp" content='{"version":"1","imageUrl":"https://ai-match-psi.vercel.app/images/promo.png","iconUrl":"https://ai-match-psi.vercel.app/images/icon.png","button":{"title":"Find Your AI Vibe","action":{"type":"launch_miniapp","name":"AI Match","url":"https://ai-match-psi.vercel.app","splashImageUrl":"https://ai-match-psi.vercel.app/images/splash.png","splashBackgroundColor":"#ffffff"}}}' />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --mini-app-height: 100vh;
            --mini-app-width: 100%;
          }
          @media (min-width: 425px) {
            :root {
              --mini-app-width: 424px;
              --mini-app-height: 695px;
            }
          }
          html, body {
            width: var(--mini-app-width);
            max-width: var(--mini-app-width);
            height: var(--mini-app-height);
            max-height: var(--mini-app-height);
            margin: 0 auto;
            overflow: hidden;
            box-sizing: border-box;
          }
        `}} />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}