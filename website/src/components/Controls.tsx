

interface ControlsProps {
  search: string;
  setSearch: (val: string) => void;
  speed: number;
  setSpeed: (val: number) => void;
  color: string;
  setColor: (val: string) => void;
}

export function Controls({ search, setSearch, speed, setSpeed, color, setColor }: ControlsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <input
        type="text"
        placeholder="Search animations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="glass-panel"
        style={{
          flex: 1,
          minWidth: '250px',
          padding: '1rem 1.5rem',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      />

      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          minWidth: '320px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Speed
        </span>
        <input
          type="range"
          min="0.25"
          max="3.0"
          step="0.25"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ flex: 1, cursor: 'pointer' }}
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-color)', minWidth: '3.5rem', textAlign: 'right' }}>
          {speed.toFixed(2)}x
        </span>
      </div>

      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Color
        </span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </div>
  );
}
