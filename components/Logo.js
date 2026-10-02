export default function Logo({ size = 56 }) {
  return (
    <svg width={size * 0.72} height={size} viewBox="0 0 72 100" fill="none" aria-label="Must Beauty">
      <rect x="3" y="3" width="60" height="94" rx="30" stroke="#A8123A" strokeWidth="2.5" />
      <text x="14" y="52" fontFamily="Georgia, serif" fontSize="30" fontWeight="600" fill="#A8123A">M</text>
      <text x="32" y="78" fontFamily="Georgia, serif" fontSize="30" fontWeight="600" fill="#A8123A">B</text>
      <path d="M62 14 Q63 24 72 26 Q63 28 62 38 Q61 28 52 26 Q61 24 62 14Z" fill="#A8123A" />
    </svg>
  );
}
