import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80',
];

export default function Hero({
  headline = 'The Ultimate staples',
  cta = 'SHOP ACTIVE',
  ctaLink = '/shop?category=active',
  images = DEFAULT_IMAGES,
}) {
  const slides = images.length ? images : DEFAULT_IMAGES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="hero" aria-label="Hero">
      <div
        className="hero__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div className="hero__slide" key={src + i}>
            <img
              src={src}
              alt=""
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>

      <div className="hero__content">
        <h1 className="hero__headline">{headline}</h1>
        <Link to={ctaLink} className="btn-ghost btn-ghost--light">
          {cta}
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="hero__dots" role="tablist" aria-label="Hero slides">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero__dot ${i === index ? 'is-active' : ''}`}
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
