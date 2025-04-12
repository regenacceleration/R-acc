import {Source_Code_Pro,Courier_Prime,Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const sourceCodePro = Noto_Sans_Georgian({
  variable: "--primary-font",
  subsets: ["latin"],
  weight: ['200' , '300' , '400' , '500' , '600' , '700' , '800' , '900']
});

const courierPrime = Courier_Prime({
  variable: "--secondary-font",
  subsets: ["latin"],
  weight: ['400','700']
});

export const metadata = {
  title: "R-acc",
  description: "degen to regen pipeline",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sourceCodePro.variable} ${courierPrime.variable} antialiased`}
      >
        <Toaster position="top-center" />
        {children}
        {/* <PrelineScript /> */}
       
      </body>
    </html>
  );
}
