import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Controls } from './components/Controls';
import { SpinnerGrid } from './components/SpinnerGrid';
import { Documentation } from './components/Documentation';

function App() {
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [color, setColor] = useState('#7c3aed');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <Hero theme={theme} toggleTheme={toggleTheme} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <Controls
          search={search}
          setSearch={setSearch}
          speed={speed}
          setSpeed={setSpeed}
          color={color}
          setColor={setColor}
        />
        <SpinnerGrid search={search} speedMultiplier={speed} color={color} />
        <Documentation />
      </main>
    </div>
  );
}

export default App;
