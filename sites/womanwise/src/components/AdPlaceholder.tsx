import React from 'react';

interface AdPlaceholderProps {
  size: 'full' | 'half';
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
}

const HOUSE_ADS: HouseAd[] = [
  {
    eyebrow: 'From our publisher',
    title: 'From Zero to Online Income',
    body: 'The honest, no-hype guide to starting a one-person business — with a chapter-matched workbook included. $17, everything included.',
    cta: 'Start from zero →',
    url: 'https://wickedstacks.com/p/from-zero-to-online-income',
    coverTitle: 'FROM ZERO', coverSub: 'to Online Income', coverFrom: '#0e7490', coverTo: '#155e75',
  },
  {
    eyebrow: 'From our publisher',
    title: 'Stuck No More',
    body: 'Rebuilding motivation, confidence, and direction — practical self-help that meets you where you are. No 5 AM cold plunges required.',
    cta: 'Get unstuck →',
    url: 'https://wickedstacks.com/p/stuck-no-more',
    coverTitle: 'STUCK', coverSub: 'No More', coverFrom: '#7c3aed', coverTo: '#4c1d95',
  },
  {
    eyebrow: 'From our publisher',
    title: 'The Digital Tapestry',
    body: 'What social media is actually doing to your brain — and how to take your attention back. Ebook + full audiobook, one price.',
    cta: 'Take your brain back →',
    url: 'https://wickedstacks.com/p/the-digital-tapestry',
    coverTitle: 'THE DIGITAL', coverSub: 'Tapestry', coverFrom: '#be185d', coverTo: '#831843',
  },
  {
    eyebrow: 'Wicked Stacks',
    title: 'Books that respect you',
    body: 'Buy a book, get the whole book — PDF, EPUB, workbooks, audiobooks. One price, instant delivery, future upgrades free.',
    cta: 'Browse the shelf →',
    url: 'https://wickedstacks.com',
    coverTitle: 'WICKED', coverSub: 'Stacks™', coverFrom: '#b45309', coverTo: '#78350f',
  },
];

const BookCover: React.FC<{ ad: HouseAd }> = ({ ad }) => (
  <div
    className="flex-shrink-0 rounded-r-md rounded-l-sm shadow-lg flex flex-col items-center justify-center text-center px-2"
    style={{
      width: '92px',
      height: '132px',
      background: `linear-gradient(150deg, ${ad.coverFrom}, ${ad.coverTo})`,
      boxShadow: '4px 6px 14px rgba(0,0,0,0.25), inset 6px 0 8px -6px rgba(255,255,255,0.5), inset -2px 0 6px -2px rgba(0,0,0,0.4)',
      transform: 'rotate(-2deg)',
    }}
  >
    <span className="text-white font-bold leading-tight" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>{ad.coverTitle}</span>
    <span className="text-white/85 italic leading-tight mt-1" style={{ fontSize: '11px' }}>{ad.coverSub}</span>
    <span className="text-white/60 mt-3" style={{ fontSize: '8px', letterSpacing: '1px' }}>MICHAEL GARDNER</span>
  </div>
);

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, position = 1 }) => {
  const ad = HOUSE_ADS[(position - 1 + HOUSE_ADS.length) % HOUSE_ADS.length];
  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full block bg-gradient-to-r from-stone-50 to-rose-50 border border-stone-200 hover:border-rose-300 hover:shadow-md rounded-lg transition-all"
      style={{ minHeight: '176px' }}
    >
      <div className={`p-6 flex items-center gap-6 h-full ${size === 'full' ? 'justify-center' : ''}`}>
        <BookCover ad={ad} />
        <div className={size === 'full' ? 'max-w-xl' : 'flex-1'}>
          <p className="text-rose-600 font-semibold text-xs uppercase tracking-widest mb-1">{ad.eyebrow}</p>
          <p className="text-stone-800 font-serif font-bold text-xl mb-1">{ad.title}</p>
          <p className="text-stone-600 text-sm mb-2">{ad.body}</p>
          <span className="text-rose-700 font-medium text-sm underline decoration-rose-300 underline-offset-2">{ad.cta}</span>
        </div>
      </div>
    </a>
  );
};

export const AdSection: React.FC<{ variant?: 'full' | 'half' }> = ({ variant = 'full' }) => {
  if (variant === 'full') {
    return (
      <div className="my-12 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <AdPlaceholder size="full" position={1} />
          <AdPlaceholder size="full" position={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdPlaceholder size="half" position={1} />
        <AdPlaceholder size="half" position={2} />
        <AdPlaceholder size="half" position={3} />
        <AdPlaceholder size="half" position={4} />
      </div>
    </div>
  );
};

export default AdPlaceholder;
