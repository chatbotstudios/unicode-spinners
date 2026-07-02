import { useMemo } from 'react';
import { SpinnerCard } from './SpinnerCard';
import spinnersData from 'unicode-spinners';

interface SpinnerGridProps {
  search: string;
  speedMultiplier: number;
  color: string;
}

export function SpinnerGrid({ search, speedMultiplier, color }: SpinnerGridProps) {
  const filteredSpinners = useMemo(() => {
    const query = search.toLowerCase();
    const entries = Object.entries(spinnersData as any);
    
    return entries.filter(([name, data]: [string, any]) => {
      // Basic deduplication of aliases like dots8bit vs dots-8bit
      if (!name.includes('-') && (spinnersData as any)[name.replace(/([0-9]+)/g, '-$1')] && name.match(/[0-9]/)) {
        return false;
      }
      return name.toLowerCase().includes(query) || (data.category && data.category.toLowerCase().includes(query));
    });
  }, [search]);

  // Group by category
  const categories = useMemo(() => {
    const cats: Record<string, any[]> = {};
    filteredSpinners.forEach(([name, data]: [string, any]) => {
      const c = data.category || 'general';
      if (!cats[c]) cats[c] = [];
      cats[c].push({ name, ...data });
    });
    return Object.entries(cats).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredSpinners]);

  return (
    <div>
      {categories.map(([category, items]) => (
        <div key={category} style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            {category}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {items.map((s) => (
              <SpinnerCard
                key={s.name}
                name={s.name}
                frames={s.frames}
                interval={s.interval}
                speedMultiplier={speedMultiplier}
                color={color}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
