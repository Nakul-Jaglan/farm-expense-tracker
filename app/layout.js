import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Farm & Garden Expense Tracker',
  description: 'Track your farm and garden expenses offline.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#16a34a" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-gray-50 min-h-screen">
          <SignedOut>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-6">Farm & Garden Expense Tracker</h1>
                <p className="text-gray-600 mb-6">Please sign in to continue</p>
                <SignInButton mode="modal">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="absolute top-4 right-4 z-50">
              <UserButton />
            </div>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
