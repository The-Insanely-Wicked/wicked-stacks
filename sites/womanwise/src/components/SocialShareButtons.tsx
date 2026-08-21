import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ShareCounts {
  twitter: number;
  facebook: number;
  linkedin: number;
  pinterest: number;
  total: number;
}

interface SocialShareButtonsProps {
  articleSlug: string;
  articleTitle: string;
  articleExcerpt: string;
  articleImage?: string;
  shareCounts?: ShareCounts;
  onShareComplete?: (platform: string, newCount: number) => void;
  variant?: 'full' | 'compact';
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  articleSlug,
  articleTitle,
  articleExcerpt,
  articleImage,
  shareCounts = { twitter: 0, facebook: 0, linkedin: 0, pinterest: 0, total: 0 },
  onShareComplete,
  variant = 'full'
}) => {
  const [sharing, setSharing] = useState<string | null>(null);
  const [localCounts, setLocalCounts] = useState<ShareCounts>(shareCounts);

  // Generate the article URL
  const articleUrl = `${window.location.origin}?article=${articleSlug}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(articleTitle);
  const encodedExcerpt = encodeURIComponent(articleExcerpt);
  const encodedImage = articleImage ? encodeURIComponent(articleImage) : '';

  const trackShare = async (platform: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('article-shares', {
        body: { action: 'track', articleSlug, platform }
      });

      if (error) throw error;

      if (data.success) {
        const newCounts = {
          ...localCounts,
          [platform]: data.shareCount,
          total: localCounts.total + 1
        };
        setLocalCounts(newCounts);
        onShareComplete?.(platform, data.shareCount);
      }
    } catch (err) {
      console.error('Error tracking share:', err);
    }
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    setSharing(platform);
    
    // Open share dialog
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      shareUrl,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    // Track the share
    await trackShare(platform);
    setSharing(null);
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}%20-%20${encodedExcerpt}`
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleShare('twitter', shareUrls.twitter)}
          disabled={sharing === 'twitter'}
          className="p-1.5 text-stone-400 hover:text-[#1DA1F2] hover:bg-blue-50 rounded-full transition-colors"
          title="Share on Twitter"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
        <button
          onClick={() => handleShare('facebook', shareUrls.facebook)}
          disabled={sharing === 'facebook'}
          className="p-1.5 text-stone-400 hover:text-[#1877F2] hover:bg-blue-50 rounded-full transition-colors"
          title="Share on Facebook"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        <button
          onClick={() => handleShare('linkedin', shareUrls.linkedin)}
          disabled={sharing === 'linkedin'}
          className="p-1.5 text-stone-400 hover:text-[#0A66C2] hover:bg-blue-50 rounded-full transition-colors"
          title="Share on LinkedIn"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
        {localCounts.total > 0 && (
          <span className="text-xs text-stone-400 ml-1">{formatCount(localCounts.total)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-stone-50 rounded-xl p-6">
      <h4 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share This Article
        {localCounts.total > 0 && (
          <span className="text-sm font-normal text-stone-500">
            ({formatCount(localCounts.total)} shares)
          </span>
        )}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Twitter/X */}
        <button
          onClick={() => handleShare('twitter', shareUrls.twitter)}
          disabled={sharing === 'twitter'}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-stone-200 hover:border-[#1DA1F2] hover:bg-blue-50 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-[#1DA1F2] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-stone-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-stone-700 group-hover:text-[#1DA1F2]">
            {sharing === 'twitter' ? 'Sharing...' : 'Twitter'}
          </span>
          {localCounts.twitter > 0 && (
            <span className="text-xs text-stone-500">{formatCount(localCounts.twitter)}</span>
          )}
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook', shareUrls.facebook)}
          disabled={sharing === 'facebook'}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-stone-200 hover:border-[#1877F2] hover:bg-blue-50 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-[#1877F2] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-stone-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-stone-700 group-hover:text-[#1877F2]">
            {sharing === 'facebook' ? 'Sharing...' : 'Facebook'}
          </span>
          {localCounts.facebook > 0 && (
            <span className="text-xs text-stone-500">{formatCount(localCounts.facebook)}</span>
          )}
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin', shareUrls.linkedin)}
          disabled={sharing === 'linkedin'}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-stone-200 hover:border-[#0A66C2] hover:bg-blue-50 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-[#0A66C2] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-stone-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-stone-700 group-hover:text-[#0A66C2]">
            {sharing === 'linkedin' ? 'Sharing...' : 'LinkedIn'}
          </span>
          {localCounts.linkedin > 0 && (
            <span className="text-xs text-stone-500">{formatCount(localCounts.linkedin)}</span>
          )}
        </button>

        {/* Pinterest */}
        <button
          onClick={() => handleShare('pinterest', shareUrls.pinterest)}
          disabled={sharing === 'pinterest'}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-stone-200 hover:border-[#E60023] hover:bg-red-50 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-[#E60023] flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-stone-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-stone-700 group-hover:text-[#E60023]">
            {sharing === 'pinterest' ? 'Sharing...' : 'Pinterest'}
          </span>
          {localCounts.pinterest > 0 && (
            <span className="text-xs text-stone-500">{formatCount(localCounts.pinterest)}</span>
          )}
        </button>
      </div>

      {/* Copy Link */}
      <div className="mt-4 pt-4 border-t border-stone-200">
        <button
          onClick={() => {
            navigator.clipboard.writeText(articleUrl);
            alert('Link copied to clipboard!');
          }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50 transition-all text-stone-700 hover:text-rose-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShareButtons;
