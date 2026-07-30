import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import MarqueeStrip from '../components/MarqueeStrip';
import ProductGrid from '../components/ProductGrid';
import SplitEditorial from '../components/SplitEditorial';
import CategoryTabs from '../components/CategoryTabs';
import { productsApi, siteConfigApi } from '../lib/api';
import { useReveal } from '../hooks/useReveal';

export default function Home() {
  const [site, setSite] = useState(null);
  const [trending, setTrending] = useState([]);
  const [news, setNews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState('shirts');
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const filterRef = useReveal();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [siteRes, trendRes, newRes, configRes] = await Promise.all([
          productsApi.site().catch(() => null),
          productsApi.list({ trending: 'true', limit: 8 }),
          productsApi.list({ newArrival: 'true', limit: 4 }),
          siteConfigApi.get().catch(() => null),
        ]);
        if (cancelled) return;
        // merge DB site config over seed SITE data
        setSite(configRes ? { ...siteRes, hero: { headline: configRes.heroHeadline, cta: configRes.heroCta, ctaLink: '/shop', images: configRes.heroImages }, editorial: (configRes.editorialImages || []).map((img, i) => ({ image: img, alt: `Editorial ${i+1}` })), announcement: configRes.announcement, filters: siteRes?.filters } : siteRes);
        setTrending(trendRes.products || []);
        setNews(newRes.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setFilterLoading(true);
    productsApi
      .list({ tag: tab, limit: 8 })
      .then((res) => {
        if (!cancelled) setFiltered(res.products || []);
      })
      .catch(() => {
        if (!cancelled) setFiltered([]);
      })
      .finally(() => {
        if (!cancelled) setFilterLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const hero = site?.hero;
  const editorial = site?.editorial || [];

  return (
    <>
      <Hero
        headline={hero?.headline}
        cta={hero?.cta}
        ctaLink={hero?.ctaLink}
        images={hero?.images}
      />

      <MarqueeStrip />

      <ProductGrid
        title="New & Trending"
        products={trending}
        loading={loading}
        linkTo="/shop?trending=true"
      />

      <SplitEditorial images={editorial.slice(0, 2)} />

      <section className="section container reveal" ref={filterRef}>
        <div className="product-section__head">
          <h2 className="product-section__title">Shop by category</h2>
        </div>
        <CategoryTabs
          tabs={site?.filters || ['HOODIES', 'SHORTS', 'T-SHIRTS', 'LEGGINGS', 'SETS']}
          active={tab}
          onChange={(value) => setTab(value)}
        />
      </section>

      <ProductGrid products={filtered} loading={filterLoading} showTitle={false} />

      {editorial.length > 2 && (
        <div style={{ marginTop: 'var(--section-gap)' }}>
          <SplitEditorial images={editorial.slice(2, 4)} />
        </div>
      )}

      <ProductGrid
        title="Just in"
        products={news}
        loading={loading}
        linkTo="/shop?newArrival=true"
      />

      <section
        className="section surface-blush"
        style={{ textAlign: 'center', paddingBlock: 'var(--section-gap)' }}
      >
        <div className="container" style={{ maxWidth: 560 }}>
          <h2
            className="product-section__title"
            style={{ marginBottom: 12, fontWeight: 400, fontSize: 'var(--text-display)' }}
          >
            Wear the Himalayas
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-smoke-charcoal)', marginBottom: 24, lineHeight: 1.5 }}>
            Every piece handcrafted in Nepal by local artisans. Hemp, handwoven textiles,
            and Himalayan stones — slow fashion with a soul.
          </p>
          <Link to="/shop" className="btn-ghost">
            Shop all
          </Link>
        </div>
      </section>
    </>
  );
}
