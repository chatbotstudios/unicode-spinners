

interface HeroProps {
  theme: string;
  toggleTheme: () => void;
}

export function Hero({ theme, toggleTheme }: HeroProps) {
  return (
    <header style={{ textAlign: 'center', padding: '4rem 2rem 2rem', position: 'relative' }}>
      <button
        onClick={toggleTheme}
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          padding: '0.5rem 1rem',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
        }}
      >
        {theme === 'dark' ? '☀ Light Mode' : '☾ Dark Mode'}
      </button>

      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          marginBottom: '0.5rem',
          background: `linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        unicode-spinners
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
        150+ ultra-lightweight terminal & web animations
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <code
          className="glass-panel"
          style={{
            fontFamily: 'var(--font-mono)',
            padding: '0.75rem 1.5rem',
            color: 'var(--accent-color)',
            fontSize: '0.9rem',
          }}
        >
          npm install unicode-spinners
        </code>
      </div>
    </header>
  );
}
