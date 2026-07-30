const DEFAULT = ['HOODIES', 'SHORTS', 'T-SHIRTS', 'LEGGINGS', 'SETS'];

export default function CategoryTabs({ tabs = DEFAULT, active, onChange }) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Category filter">
      {tabs.map((tab) => {
        const value = tab.toLowerCase().replace(/\s+/g, '-');
        const isActive = active === value || active === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange?.(value, tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
