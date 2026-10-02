"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { STORE } from "../lib/config";
import { cop } from "../lib/products";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("mb-cart") || "[]")); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("mb-cart", JSON.stringify(items)); } catch {} }, [items]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const add = (it) => {
    setItems((cur) => {
      const i = cur.findIndex((x) => x.key === it.key);
      if (i >= 0) { const n = [...cur]; n[i] = { ...n[i], qty: Math.min(n[i].qty + 1, n[i].max) }; return n; }
      return [...cur, { ...it, qty: 1 }];
    });
    setOpen(true);
  };
  const setQty = (key, q) =>
    setItems((cur) => (q <= 0 ? cur.filter((x) => x.key !== key) : cur.map((x) => (x.key === key ? { ...x, qty: Math.min(q, x.max) } : x))));

  const count = items.reduce((a, x) => a + x.qty, 0);
  const total = items.reduce((a, x) => a + x.qty * x.price, 0);
  const message =
    `Hola ${STORE.name}, quiero hacer este pedido:\n` +
    items.map((x) => `- ${x.qty} x ${x.name}${x.variant ? ` (${x.variant})` : ""}: ${cop(x.price * x.qty)}`).join("\n") +
    `\nTotal: ${cop(total)}`;

  async function viaInstagram() {
    try { await navigator.clipboard.writeText(message); setCopied(true); } catch {}
    window.open(`https://ig.me/m/${STORE.instagram}`, "_blank");
  }

  return (
    <Ctx.Provider value={{ add, count, open, setOpen }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setOpen(false)}>
          <aside role="dialog" aria-label="Carrito" onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l-2 border-crimson bg-butter p-6 text-crimson">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Tu carrito</h2>
              <button className="text-lg underline" onClick={() => setOpen(false)}>Cerrar</button>
            </div>
            {items.length === 0 ? <p className="text-lg">Aún no has agregado productos.</p> : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto">
                  {items.map((x) => (
                    <li key={x.key} className="flex items-center justify-between gap-3 border-b border-crimson/30 pb-3">
                      <div>
                        <p className="font-semibold">{x.name}{x.variant ? ` (${x.variant})` : ""}</p>
                        <p className="text-sm">{cop(x.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="h-8 w-8 rounded-full border-2 border-crimson" aria-label="Quitar uno" onClick={() => setQty(x.key, x.qty - 1)}>−</button>
                        <span className="w-6 text-center">{x.qty}</span>
                        <button className="h-8 w-8 rounded-full border-2 border-crimson disabled:opacity-40" aria-label="Agregar uno" disabled={x.qty >= x.max} onClick={() => setQty(x.key, x.qty + 1)}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex justify-between text-xl font-semibold"><span>Total</span><span>{cop(total)}</span></p>
                <a href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"
                  className="mt-4 rounded-full bg-crimson px-5 py-3 text-center text-butter hover:bg-deep">Enviar pedido por WhatsApp</a>
                <button onClick={viaInstagram} className="mt-2 rounded-full border-2 border-crimson px-5 py-3 hover:bg-crimson hover:text-butter">Enviar por Instagram</button>
                {copied && <p role="status" className="mt-2 text-center text-sm">Pedido copiado: pégalo en el chat de Instagram.</p>}
              </>
            )}
          </aside>
        </div>
      )}
    </Ctx.Provider>
  );
}
