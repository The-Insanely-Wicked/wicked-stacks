import React from 'react';

interface AmazonProductLinkProps {
  productName: string;
  keyword: string;
  children?: React.ReactNode;
}

const AmazonProductLink: React.FC<AmazonProductLinkProps> = ({ productName, keyword, children }) => {
  // Amazon affiliate link structure - replace YOUR-TAG with actual affiliate tag
  const affiliateTag = 'michaelgard0e-20';
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=${affiliateTag}`;
  
  return (
    <a 
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-medium underline decoration-amber-300 hover:decoration-amber-500 underline-offset-2 transition-colors"
      title={`Shop ${productName} on Amazon (Affiliate Link)`}
    >
      {children || productName}
      <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </a>
  );
};

export const ProductCallout: React.FC<{
  productName: string;
  keyword: string;
  description: string;
  price?: string;
}> = ({ productName, keyword, description, price }) => {
  const affiliateTag = 'michaelgard0e-20';
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=${affiliateTag}`;
  
  return (
    <div className="my-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide bg-amber-100 px-2 py-0.5 rounded">
              Amazon Pick
            </span>
            {price && <span className="text-sm text-stone-500">{price}</span>}
          </div>
          <h4 className="font-semibold text-stone-800 mb-1">{productName}</h4>
          <p className="text-sm text-stone-600 mb-2">{description}</p>
          <a 
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            View on Amazon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
      <p className="text-xs text-stone-400 mt-3 pt-2 border-t border-amber-200">
        *As an Amazon Associate, we earn from qualifying purchases.
      </p>
    </div>
  );
};

export default AmazonProductLink;
