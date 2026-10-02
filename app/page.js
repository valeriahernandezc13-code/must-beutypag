import ProductCard from "../components/ProductCard";
import Divider from "../components/Divider";
import { PRODUCTS } from "../lib/products";
import { supabase } from "../lib/supabase";
import { STORE } from "../lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let products = PRODUCTS; // ejemplo mientras no conectes Supabase
  let error = null;
  if (supabase) {
    const res = await supabase.from("products").select("*").eq("active", true).order("id", { ascending: false });
    error = res.error;
    products = res.data || [];
  }
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-8 md:pt-16">
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] md:text-7xl">{STORE.tagline}</h1>
        <p className="mt-6 max-w-xl text-xl leading-relaxed">
          Maquillaje y cuidado de la piel elegidos por Must Beauty. Escríbenos y te lo enviamos.
        </p>
      </section>

      <Divider />

      <section id="catalogo" className="bg-sand px-6 pb-20 pt-8 text-crimson">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-semibold">Catálogo</h2>
          {error && <p className="mb-6 rounded-xl border-2 border-crimson p-4">Error al leer productos: {error.message}</p>}
          {products.length === 0 ? <p className="text-lg">Pronto tendremos productos nuevos.</p> : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
