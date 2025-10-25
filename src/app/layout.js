import "./globals.css";

export const metadata = {
  title: "Placeholder",
  description: "Blablaidk",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
