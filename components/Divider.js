// Arcos que repiten el óvalo del logo. Relleno carmesí sobre el fondo mantequilla.
export default function Divider() {
  const n = 14, w = 100;
  let d = "M0 60";
  for (let i = 1; i <= n; i++) d += ` A${w / 2} 50 0 0 1 ${i * w} 60`;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${n * w} 60`} preserveAspectRatio="none" className="block h-8 w-full fill-sand md:h-12">
      <path d={d + " Z"} />
    </svg>
  );
}
