import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pemantau Cuaca Nusantara - Portal Meteorologi & Geofisika",
  description: "Dashboard pemantauan cuaca real-time Indonesia dengan Windy Interactive Map, Open-Meteo, dan BMKG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-200 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
