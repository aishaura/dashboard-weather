import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Monitoring Cuaca Indonesia",
  description: "Dashboard pemantauan cuaca real-time Indonesia dengan Windy Map dan Open-Meteo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-bgPrimary text-textPrimary antialiased selection:bg-accentBlue selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
