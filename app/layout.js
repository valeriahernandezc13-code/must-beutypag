import "./globals.css";
import { Fraunces } from "next/font/google";
import Logo from "../components/Logo";
import { CartProvider } from "../components/CartContext";
import CartButton from "../components/CartButton";
import { STORE } from "../lib/config";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata = { title: "Must Beauty", description: STORE.tagline };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={fraunces.variable}>
      <body>
        <CartProvider>
          <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <a href="/" aria-label="Inicio"><Logo size={56} /></a>
            <nav className="flex items-center gap-6 text-lg">
              <a href="/#catalogo" className="hover:underline">Catálogo</a>
              <CartButton />
            </nav>
          </header>
          {children}
          <footer className="bg-sand px-6 pb-10 text-sm text-crimson">
            <div className="mx-auto max-w-6xl border-t border-crimson/30 pt-6">© {new Date().getFullYear()} {STORE.name}</div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
