import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BoilerBasket",
  description: "ACE Food Pantry's appointment scheduling app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}