const PHRASES = [
  'The Ultimate staples',
  'Move freely',
  'Editorial activewear',
  'Quiet essentials',
  'New & Trending',
];

export default function MarqueeStrip() {
  const items = [...PHRASES, ...PHRASES];
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-strip__track">
        {items.map((t, i) => (
          <span className="marquee-strip__item" key={`${t}-${i}`}>
            {t} ·
          </span>
        ))}
      </div>
    </div>
  );
}
