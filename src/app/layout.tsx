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
  title: "Фото Будка | Онлайн фотобудка - Создавай крутые фото бесплатно",
  description: "Бесплатная онлайн фотобудка для создания стильных фотолент. Выбери настроение, сделай серию снимков, примени фильтры и скачай результат. Без регистрации и SMS!",
  keywords: ["фото будка", "фотобудка онлайн", "бесплатная фотобудка", "фотолента", "фильтры для фото", "онлайн камера", "сделать фото онлайн"],
  authors: [{ name: "Photo Booth Team" }],
  creator: "Photo Booth",
  publisher: "Photo Booth",
  applicationName: "Фото Будка",
  generator: "Next.js",

  metadataBase: new URL("https://photo.dmitri-server.ru"),

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://photo.dmitri-server.ru",
    title: "Фото Будка | Онлайн фотобудка",
    description: "Создавай крутые фотоленты онлайн бесплатно. Выбери настроение, сделай фото, примени фильтры!",
    siteName: "Фото Будка",
  },

  twitter: {
    card: "summary",
    title: "Фото Будка | Онлайн фотобудка",
    description: "Создавай крутые фотоленты онлайн бесплатно",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.svg",
  },

  manifest: "/site.webmanifest",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
