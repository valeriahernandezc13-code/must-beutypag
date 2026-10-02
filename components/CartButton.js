"use client";
import { useCart } from "./CartContext";

export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} className="rounded-full border-2 border-crimson px-4 py-1 hover:bg-crimson hover:text-butter">
      Carrito ({count})
    </button>
  );
}
