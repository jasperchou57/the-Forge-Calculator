import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          backgroundColor: '#040404',
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.25), transparent 55%), radial-gradient(circle at 80% 30%, rgba(99,102,241,0.20), transparent 55%)',
          color: '#ffffff',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background:
                'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(99,102,241,0.25))',
              border: '1px solid rgba(59,130,246,0.35)',
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            ForgeCalc
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: -1.5,
          }}
        >
          The Forge Calculator
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 900,
          }}
        >
          Shareable forging recipes, real probability tables, and a full ore database for Roblox The Forge.
        </div>

        <div
          style={{
            marginTop: 34,
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          {['88 Ores', 'World 1-3', 'Reproducible Links', 'Fast + Mobile Friendly'].map((label) => (
            <div
              key={label}
              style={{
                fontSize: 22,
                padding: '10px 14px',
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 80,
            fontSize: 22,
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          forgeore.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
