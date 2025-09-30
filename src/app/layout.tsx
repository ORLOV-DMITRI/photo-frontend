import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.scss";
import ThemeProvider from "@/providers/ThemeProvider";
import WelcomeModal from "@/components/WelcomeModal/WelcomeModal";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Фото Будка",
  description: "Создайте незабываемые фотографии с друзьями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <WelcomeModal />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
