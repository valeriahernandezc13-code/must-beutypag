"use client";
import { useState } from "react";
import { cop } from "../lib/products";
import { useCart } from "./CartContext";

export default function ProductCard({ p }) {
  const { add } = useCart();
  const variants = p.variants || [];
  const [sel, setSel] = useState(Math.max(0, variants.findIndex((v) => v.stock > 0)));

  const cur = variants[sel];
  const price = cur ? cur.price : p.price;
  const stock = cur ? cur.stock : p.stock;
  const soldOut = variants.length ? variants.every((v) => v.stock <= 0) : p.stock <= 0;

  return (
    <article className="flex flex-col">
      <div className="aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-full border-2 border-crimson bg-white flex items-end justify-center">
        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <span className="pb-8 text-5xl text-crimson">✦</span>}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold">{p.name}</h3>
        <span className="text-lg">{cop(price)}</span>
      </div>
      <p className="text-sm opacity-80">{p.category}</p>
      {p.description && <p className="mt-1 text-sm leading-snug">{p.description}</p>}
      {variants.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Tamaño">
          {variants.map((v, i) => (
            <button key={i} type="button" role="radio" aria-checked={i === sel} disabled={v.stock <= 0} onClick={() => setSel(i)}
              className={`rounded-full border-2 border-crimson px-4 py-1 text-sm transition disabled:line-through disabled:opacity-40 ${i === sel ? "bg-crimson text-butter" : "hover:bg-butter"}`}>
              {v.name}
            </button>
          ))}
        </div>
      )}
      {soldOut ? (
        <span className="mt-3 rounded-full border-2 border-crimson/40 px-5 py-2 text-center opacity-70">Agotado</span>
      ) : (
        <button onClick={() => add({ key: `${p.id}-${cur ? cur.name : ""}`, name: p.name, variant: cur?.name, price, max: stock })}
          className="mt-3 rounded-full bg-crimson px-5 py-2 text-center text-butter transition hover:bg-deep">
          Agregar al carrito
        </button>
      )}
    </article>
  );
}
