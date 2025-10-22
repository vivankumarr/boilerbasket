import { Inter, K2D } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const k2d = K2D({
  variable: "--font-k2d",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Placeholder",
  description: "Blablaidk",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${k2d.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
