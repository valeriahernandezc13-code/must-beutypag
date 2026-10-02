"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { cop } from "../../lib/products";

const empty = { name: "", category: "", price: "", stock: "", image: "", description: "", variants: [], active: true };
const input = "w-full rounded-xl border-2 border-crimson bg-cream px-4 py-2 outline-none";
const btn = "rounded-full bg-crimson px-6 py-2 text-butter hover:bg-deep disabled:opacity-50";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setVar = (i, k) => (e) => setForm({ ...form, variants: form.variants.map((v, j) => (j === i ? { ...v, [k]: e.target.value } : v)) });

  useEffect(() => {
    if (!supabase) return setReady(true);
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (session) load(); }, [session]);

  async function load() {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    setItems(data || []);
  }
  async function login(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setMsg(error ? "Correo o contraseña incorrectos." : "");
  }
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    const path = `${Date.now()}-${file.name.replace(/[^\w.]/g, "_")}`;
    const { error } = await supabase.storage.from("products").upload(path, file);
    if (error) setMsg("No se pudo subir la foto: " + error.message);
    else setForm((f) => ({ ...f, image: supabase.storage.from("products").getPublicUrl(path).data.publicUrl }));
    setBusy(false);
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    const vars = form.variants.filter((v) => v.name.trim()).map((v) => ({ name: v.name.trim(), price: Number(v.price) || 0, stock: Number(v.stock) || 0 }));
    const row = { name: form.name, category: form.category, description: form.description, variants: vars, price: vars.length ? Math.min(...vars.map((v) => v.price)) : Number(form.price), stock: vars.length ? vars.reduce((a, v) => a + v.stock, 0) : Number(form.stock), image: form.image, active: form.active };
    const q = editing ? supabase.from("products").update(row).eq("id", editing) : supabase.from("products").insert(row);
    const { error } = await q;
    setMsg(error ? "Error: " + error.message : editing ? "Producto actualizado." : "Producto agregado.");
    if (!error) { setForm(empty); setEditing(null); load(); }
    setBusy(false);
  }
  async function remove(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }
  async function quick(p, patch) {
    await supabase.from("products").update(patch).eq("id", p.id);
    load();
  }
  function edit(p) {
    setEditing(p.id);
    setForm({ name: p.name, category: p.category || "", description: p.description || "", variants: p.variants || [], price: p.price, stock: p.stock, image: p.image || "", active: p.active });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!ready) return null;
  if (!supabase) return <main className="mx-auto max-w-xl p-8 text-lg">Falta conectar Supabase. Crea el archivo <b>.env.local</b> (mira <b>.env.local.example</b>) y reinicia <b>npm run dev</b>.</main>;

  if (!session) return (
    <main className="mx-auto max-w-sm px-6 py-20">
      <h1 className="mb-6 text-3xl font-semibold">Entrar al panel</h1>
      <form onSubmit={login} className="space-y-4">
        <input className={input} type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <button className={btn}>Entrar</button>
        {msg && <p role="alert">{msg}</p>}
      </form>
    </main>
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Productos</h1>
        <div className="flex gap-4"><a href="/" className="underline">Ver tienda</a><button className="underline" onClick={() => supabase.auth.signOut()}>Salir</button></div>
      </div>

      <form onSubmit={save} className="mb-10 grid gap-3 rounded-3xl border-2 border-crimson p-5 md:grid-cols-2">
        <h2 className="text-xl font-semibold md:col-span-2">{editing ? "Editar producto" : "Agregar producto"}</h2>
        <input className={input} placeholder="Nombre" value={form.name} onChange={set("name")} required />
        <input className={input} placeholder="Categoría (Labios, Ojos…)" value={form.category} onChange={set("category")} />
        <textarea className={input + " md:col-span-2"} rows={3} placeholder="Descripción del producto" value={form.description} onChange={set("description")} />
        <input className={input} type="number" min="0" placeholder="Precio en COP" value={form.price} onChange={set("price")} required={form.variants.length === 0} />
        <input className={input} type="number" min="0" placeholder="Cantidad en stock" value={form.stock} onChange={set("stock")} required={form.variants.length === 0} />
        <div className="md:col-span-2">
          <p className="font-semibold">Tamaños (opcional)</p>
          <p className="mb-2 text-sm">Si viene en varios tamaños, agrégalos aquí. Entonces el precio y el stock de arriba no se usan.</p>
          {form.variants.map((v, i) => (
            <div key={i} className="mb-2 grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
              <input className={input} placeholder="Tamaño (Mini)" value={v.name} onChange={setVar(i, "name")} />
              <input className={input} type="number" min="0" placeholder="Precio" value={v.price} onChange={setVar(i, "price")} />
              <input className={input} type="number" min="0" placeholder="Stock" value={v.stock} onChange={setVar(i, "stock")} />
              <button type="button" className="underline" onClick={() => setForm({ ...form, variants: form.variants.filter((_, j) => j !== i) })}>Quitar</button>
            </div>
          ))}
          <button type="button" className="underline" onClick={() => setForm({ ...form, variants: [...form.variants, { name: "", price: "", stock: "" }] })}>+ Agregar tamaño</button>
        </div>
        <div className="flex items-center gap-3 md:col-span-2">
          {form.image && <img src={form.image} alt="" className="h-16 w-16 rounded-xl object-cover" />}
          <input type="file" accept="image/*" onChange={upload} />
        </div>
        <label className="flex items-center gap-2 md:col-span-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visible en la tienda</label>
        <div className="flex gap-3 md:col-span-2">
          <button className={btn} disabled={busy}>{editing ? "Guardar cambios" : "Agregar producto"}</button>
          {editing && <button type="button" className="underline" onClick={() => { setEditing(null); setForm(empty); }}>Cancelar</button>}
        </div>
        {msg && <p role="status" className="md:col-span-2">{msg}</p>}
      </form>

      {items.length === 0 && <p className="text-lg">Aún no tienes productos. Agrega el primero arriba.</p>}
      <ul className="space-y-3">
        {items.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-crimson/40 p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">{p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}</div>
            <div className="min-w-[10rem] flex-1">
              <p className="font-semibold">{p.name} {!p.active && <span className="text-sm opacity-70">(oculto)</span>}</p>
              <p className="text-sm">{p.variants?.length ? "Desde " : ""}{cop(p.price)} · {p.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-8 w-8 rounded-full border-2 border-crimson" aria-label="Restar stock" disabled={p.variants?.length > 0} onClick={() => quick(p, { stock: Math.max(0, p.stock - 1) })}>−</button>
              <span className="min-w-16 text-center text-sm">{p.variants?.length ? p.variants.map((v) => `${v.name}: ${v.stock}`).join(" · ") : `${p.stock} en stock`}</span>
              <button className="h-8 w-8 rounded-full border-2 border-crimson" aria-label="Sumar stock" disabled={p.variants?.length > 0} onClick={() => quick(p, { stock: p.stock + 1 })}>+</button>
            </div>
            <div className="flex gap-3 text-sm">
              <button className="underline" onClick={() => edit(p)}>Editar</button>
              <button className="underline" onClick={() => quick(p, { active: !p.active })}>{p.active ? "Ocultar" : "Mostrar"}</button>
              <button className="underline" onClick={() => remove(p.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
