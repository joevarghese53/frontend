import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { Providers } from "./providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <Providers>
          <ThemeProvider>
            <header>
              <Navbar></Navbar>
            </header>
            <main>{children}</main>
            <footer>
              <Footer></Footer>
            </footer>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
