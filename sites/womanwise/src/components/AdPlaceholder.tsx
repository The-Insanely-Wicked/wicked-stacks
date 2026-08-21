import React from 'react';

interface AdPlaceholderProps {
  size: 'full' | 'half';
  position?: number;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, position = 1 }) => {
  return (
    <div 
      className={`${size === 'full' ? 'w-full' : 'w-full md:w-1/2'} bg-gradient-to-r from-stone-100 to-stone-200 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center`}
      style={{ minHeight: size === 'full' ? '250px' : '200px' }}
    >
      <div className="text-center p-6">
        <div className="w-12 h-12 mx-auto mb-3 bg-stone-300 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-stone-500 font-medium text-sm uppercase tracking-wide">
          {size === 'full' ? 'Full Width' : 'Half Width'} Display Ad
        </p>
        <p className="text-stone-400 text-xs mt-1">Ad Slot #{position}</p>
        <p className="text-stone-400 text-xs mt-2">
          {size === 'full' ? '728x90 or 970x250' : '300x250 or 336x280'}
        </p>
      </div>
    </div>
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
