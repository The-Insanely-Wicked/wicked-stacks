import React from 'react';

interface AdSpaceProps {
  type: 'full' | 'half';
  className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ type, className = '' }) => {
  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${type === 'full' ? 'w-full h-[250px]' : 'w-full md:w-[48%] h-[250px]'} ${className}`}>
      <div className="text-center text-gray-500">
        <div className="text-sm font-medium uppercase tracking-wide">Advertisement</div>
        <div className="text-xs mt-1">{type === 'full' ? '728x250' : '336x250'} Display Ad</div>
        <div className="text-xs text-gray-400 mt-2">Ad Space - Insert Google AdSense or Direct Ad Code Here</div>
      </div>
    </div>
  );
};

export const AdSection: React.FC<{ variant?: 'full' | 'half' }> = ({ variant = 'full' }) => {
  if (variant === 'full') {
    return (
      <div className="my-12 px-4">
        <AdSpace type="full" />
        <div className="mt-4">
          <AdSpace type="full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-12 px-4 flex flex-wrap gap-4 justify-center">
      <AdSpace type="half" />
      <AdSpace type="half" />
      <AdSpace type="half" />
      <AdSpace type="half" />
    </div>
  );
};

export default AdSpace;
