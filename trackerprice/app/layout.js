import "./globals.css";

export const metadata = {
  title: "Price Tracker",
  description: "Track your prices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
