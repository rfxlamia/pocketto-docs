import { ImageResponse } from 'next/og';

export const alt = 'Pocketto: accountable AI coding workflows for Claude Code and Pi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf8f3',
          padding: 72,
          color: '#201b15',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              border: '5px solid #201b15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 14, height: 26, background: '#bd3d0a', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>Pocketto</div>
          <div
            style={{
              marginLeft: 12,
              padding: '6px 14px',
              borderRadius: 6,
              border: '2px solid rgba(32,27,21,0.25)',
              fontSize: 20,
              color: '#57503f',
            }}
          >
            v4.2.2
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, maxWidth: 900 }}>
            AI writes the code. Pocketto makes the process accountable.
          </div>
          <div style={{ fontSize: 30, color: '#57503f', maxWidth: 860 }}>
            Plan before code · delegate with contracts · review independently · close on your word.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {['pitching', 'grinding', 'planning', 'structuring', 'development', 'closing'].map((s) => (
            <div
              key={s}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: '2px solid rgba(32,27,21,0.2)',
                fontSize: 22,
                color: '#57503f',
                display: 'flex',
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
