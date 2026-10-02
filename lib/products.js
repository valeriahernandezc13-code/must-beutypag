// Productos de ejemplo. En el siguiente paso vendrán de Supabase (tu panel admin).
export const PRODUCTS = [
  { id: 1, name: "Labial Carmesí", category: "Labios", price: 32000, stock: 12 },
  { id: 2, name: "Gloss Mantequilla", category: "Labios", price: 28000, stock: 20 },
  { id: 3, name: "Rubor en crema", category: "Rostro", price: 36000, stock: 8 },
  { id: 4, name: "Sérum de brillo", category: "Skincare", price: 65000, stock: 0 },
  { id: 5, name: "Paleta de sombras", category: "Ojos", price: 58000, stock: 5 },
  { id: 6, name: "Máscara de pestañas", category: "Ojos", price: 39000, stock: 15 },
];
export const cop = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
