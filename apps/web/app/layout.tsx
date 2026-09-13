import type { Metadata } from "next";
import { Trirong, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const trirong = Trirong({
  variable: "--font-trirong",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ณัฐศักดิ์ วิวัฒน์วิศวกร - Senior Software Engineer",
  description: "CV และเครื่องมือส่วนตัวของ waivern",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${trirong.variable} ${plex.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
