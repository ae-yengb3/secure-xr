import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import WebSocketProvider from "@/components/WebSocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SecureScanX - Ghana's Intelligent Cyber Defense Tool",
  description: "Ghana's leading cybersecurity scanning and monitoring platform",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StoreProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
