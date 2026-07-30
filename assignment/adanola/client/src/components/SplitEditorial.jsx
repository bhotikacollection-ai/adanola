import { useReveal } from '../hooks/useReveal';

export default function SplitEditorial({ images = [] }) {
  const ref = useReveal();
  if (!images.length) return null;

  const pair = images.slice(0, 2);

  return (
    <section className="split-editorial reveal" ref={ref} aria-label="Editorial">
      {pair.map((item, i) => (
        <div className="split-editorial__item" key={item.image || i}>
          <img src={item.image} alt={item.alt || ''} loading="lazy" />
        </div>
      ))}
    </section>
  );
}
