import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Agri Link",
  description: "Crop aggregation platfrom for farmers to meet order demands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
