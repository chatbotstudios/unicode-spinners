import type { ReactNode } from 'react';

function CodeBlock({ code }: { code: string }) {
  // A lightweight syntax highlighter for static examples
  const highlighted = code
    .replace(/'([^']+)'/g, '<span class="token string">\'$1\'</span>')
    .replace(/\b(import|from|const|let|var|function|return|await|async|export)\b/g, '<span class="token keyword">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="token comment">$1</span>')
    .replace(/([a-zA-Z0-9_]+)(?=\()/g, '<span class="token function">$1</span>');

  return (
    <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
  );
}

function Section({ title, description, code }: { title: string, description: ReactNode, code: string }) {
  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{description}</p>
      <CodeBlock code={code} />
    </div>
  );
}

export function Documentation() {
  return (
    <div className="glass-panel" style={{ padding: '2.5rem 3rem', marginTop: '4rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        Documentation & Examples
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
        <code>unicode-spinners</code> provides over 150 animations as raw frame data, meaning you have complete control over how and where they are rendered. It is incredibly lightweight and has zero dependencies.
      </p>

      <Section
        title="Node.js CLI"
        description={<>The most common use case: creating a loading spinner in a terminal script using <code>process.stdout.write</code>.</>}
        code={`import spinners from 'unicode-spinners';

const { frames, interval } = spinners.braille;
let i = 0;

const timer = setInterval(() => {
  // \\r returns to the start of the line, \\x1B[2K clears the line
  process.stdout.write(\`\\r\\x1B[2K  \${frames[i++ % frames.length]} Deploying...\`);
}, interval);

await deploy();

clearInterval(timer);
process.stdout.write('\\r\\x1B[2K  ✔ Deployed.\\n');`}
      />

      <Section
        title="React Component"
        description={<>You can easily build a reusable React component using <code>useState</code> and <code>useEffect</code>.</>}
        code={`import { useState, useEffect } from 'react';
import spinners from 'unicode-spinners';

export function Spinner({ name = 'braille', text = 'Loading...' }) {
  const [frame, setFrame] = useState(0);
  const s = spinners[name];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % s.frames.length);
    }, s.interval);
    
    return () => clearInterval(timer);
  }, [name, s.interval, s.frames.length]);

  return (
    <span style={{ fontFamily: 'monospace' }}>
      {s.frames[frame]} {text}
    </span>
  );
}`}
      />

      <Section
        title="Vanilla DOM"
        description={<>Updating a text node in the browser is blazing fast.</>}
        code={`import spinners from 'unicode-spinners';

const el = document.getElementById('status');
const { frames, interval } = spinners.earth;
let i = 0;

const timer = setInterval(() => {
  el.textContent = \`\${frames[i++ % frames.length]} Syncing...\`;
}, interval);

await syncData();
clearInterval(timer);
el.textContent = '✔ Synced!';`}
      />

      <Section
        title="Custom Braille Spinners"
        description={<>You can programmatically generate your own braille patterns using the included grid utilities.</>}
        code={`import { makeGrid, gridToBraille } from 'unicode-spinners';

// Create a 4-row by 2-column grid
const grid = makeGrid(4, 2);

// Raise specific dots (true = raised)
grid[0][0] = true;
grid[1][1] = true;
grid[2][0] = true;

console.log(gridToBraille(grid)); // Outputs the resulting braille character`}
      />
    </div>
  );
}
