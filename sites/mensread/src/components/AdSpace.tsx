import React from 'react';

interface AdSpaceProps {
  type: 'full' | 'half';
  className?: string;
  position?: number;
}

interface HouseAd {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  url: string;
  coverTitle: string;
  coverSub: string;
  coverFrom: string;
  coverTo: string;
  kind: 'book' | 'app' | 'audio';
}

const HOUSE_ADS: HouseAd[] = [
  {
    eyebrow: 'From our publisher',
    title: 'Complete Business Mastery',
    body: '17 chapters of real frameworks and real numbers, zero guru fluff — plus a full toolkit of templates and 2 hours of bonus audio deep-dives. $47.',
    cta: 'Build the machine →',
    url: 'https://cbmbook.com',
    coverTitle: 'COMPLETE', coverSub: 'Business Mastery', coverFrom: '#f5a623', coverTo: '#92400e', kind: 'book',
  },
  {
    eyebrow: 'Audio series',
    title: 'Your Shit Stinks Too',
    body: 'Two hours of deep-dives on hypocrisy, bias, and the high horse nobody gets to ride. $12, price locked — every new episode free.',
    cta: 'Listen up →',
    url: 'https://wickedstacks.com/p/your-shit-stinks-too',
    coverTitle: 'YOUR SHIT', coverSub: 'Stinks Too', coverFrom: '#f2545b', coverTo: '#7c2d12', kind: 'audio',
  },
  {
    eyebrow: 'From our publisher',
    title: 'From Zero to Online Income',
    body: 'The honest guide to starting a one-person business — workbook included, no rented Lamborghinis. $17.',
    cta: 'Start from zero →',
    url: 'https://wickedstacks.com/p/from-zero-to-online-income',
    coverTitle: 'FROM ZERO', coverSub: 'to Online Income', coverFrom: '#0e7490', coverTo: '#155e75', kind: 'book',
  },
];

const CoverArt: React.FC<{ ad: HouseAd }> = ({ ad }) => (
  <div
    className="flex-shrink-0 flex flex-col items-center justify-center text-center px-2"
    style={{
      width: ad.kind === 'app' ? '120px' : '92px',
      height: ad.kind === 'app' ? '88px' : '132px',
      borderRadius: ad.kind === 'app' ? '10px' : '2px 6px 6px 2px',
      background: `linear-gradient(150deg, ${ad.coverFrom}, ${ad.coverTo})`,
      boxShadow: '4px 6px 14px rgba(0,0,0,0.45), inset 6px 0 8px -6px rgba(255,255,255,0.4), inset -2px 0 6px -2px rgba(0,0,0,0.4)',
      transform: ad.kind === 'app' ? 'none' : 'rotate(-2deg)',
    }}
  >
    <span className="text-white font-bold leading-tight" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>{ad.coverTitle}</span>
    <span className="text-white/85 italic leading-tight mt-1" style={{ fontSize: '11px' }}>{ad.coverSub}</span>
    {ad.kind === 'book' && (
      <span className="text-white/60 mt-3" style={{ fontSize: '8px', letterSpacing: '1px' }}>MICHAEL GARDNER</span>
    )}
    {ad.kind === 'audio' && <span className="text-white/80 mt-2" style={{ fontSize: '14px' }}>▶</span>}
  </div>
);

const AdSpace: React.FC<AdSpaceProps> = ({ type, className = '', position = 1 }) => {
  const ad = HOUSE_ADS[(position - 1 + HOUSE_ADS.length) % HOUSE_ADS.length];
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-slate-800 border border-slate-700 hover:border-amber-500 rounded-lg transition-colors ${type === 'full' ? 'w-full' : 'w-full md:w-[48%]'} ${className}`}
      style={{ minHeight: '176px' }}
    >
      <div className={`p-6 flex items-center gap-6 h-full ${type === 'full' ? 'justify-center' : ''}`}>
        <CoverArt ad={ad} />
        <div className={type === 'full' ? 'max-w-xl' : 'flex-1'}>
          <p className="text-amber-500 font-semibold text-xs uppercase tracking-widest mb-1">{ad.eyebrow}</p>
          <p className="text-white font-bold text-xl mb-1">{ad.title}</p>
          <p className="text-slate-400 text-sm mb-2">{ad.body}</p>
          <span className="text-amber-400 font-medium text-sm underline decoration-amber-600 underline-offset-2">{ad.cta}</span>
        </div>
      </div>
    </a>
  );
};

export const AdSection: React.FC<{ variant?: 'full' | 'half' }> = ({ variant = 'full' }) => {
  if (variant === 'full') {
    return (
      <div className="my-12 px-4">
        <AdSpace type="full" position={1} />
        <div className="mt-4">
          <AdSpace type="full" position={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 px-4 flex flex-wrap gap-4 justify-center">
      <AdSpace type="half" position={1} />
      <AdSpace type="half" position={2} />
      <AdSpace type="half" position={3} />
      <AdSpace type="half" position={4} />
    </div>
  );
};

export default AdSpace;
