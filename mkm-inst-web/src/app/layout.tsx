import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MKM Lab - 페르소나 다이어리",
  description: "AI 기반 초개인화 건강 동반자. 15초의 정성으로 당신만의 페르소나를 발견하세요.",
  keywords: ["AI 건강", "페르소나", "15초의 정성,생체신호 분석", "개인화 건강"],
  authors: [{ name: "MKM Lab" }],
  creator: "MKM Lab",
  publisher: "MKM Lab",
  robots: "index, follow",
  openGraph: {
    title: "MKM Lab - 페르소나 다이어리",
    description: "AI 기반 초개인화 건강 동반자",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
