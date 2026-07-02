import { useState, useEffect } from 'react';

interface SpinnerCardProps {
  name: string;
  frames: string[];
  interval: number;
  speedMultiplier: number;
  color: string;
}

export function SpinnerCard({ name, frames, interval, speedMultiplier, color }: SpinnerCardProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, interval / speedMultiplier);
    return () => clearInterval(timer);
  }, [frames.length, interval, speedMultiplier]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`import spinners from 'unicode-spinners';\nconst spinner = spinners['${name}'];`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        height: '140px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--accent-color)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.5rem',
          color: color,
          minHeight: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {frames[frameIdx]}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {frames.length}f · {interval}ms
        </div>
      </div>

      {copied && (
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'var(--accent-color)',
            color: '#fff',
            fontSize: '0.65rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          COPIED!
        </div>
      )}
    </div>
  );
}
