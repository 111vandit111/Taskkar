import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";
import { Suspense } from "react";
import { Loading } from "@/components/auth/loading";
import Head from "next/head";
import taskkarIcon from "@/public/taskkar.png"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskkar",
  description: "Taskkar: A task collaborative tool for the modern age",
  icons: {
    icon : {
      url : "/taskkar.png",
      href : "/taskkar.png", 
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/taskkar.png" />
      <link rel="icon" type="image/png" href="/taskkar.png" />
      </Head>
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            {children}
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
