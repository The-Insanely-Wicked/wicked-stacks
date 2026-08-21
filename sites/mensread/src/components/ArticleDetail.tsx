import React from 'react';
import { Article } from '@/types/article';
import { AdSection } from './AdSpace';
import RelatedArticles from './RelatedArticles';
import { ArrowLeft, Clock, Share2, Bookmark, ExternalLink } from 'lucide-react';

const AFF_TAG = 'michaelgard0e-20';
const withTag = (u: string) => u + (u.includes('?') ? '&' : '?') + 'tag=' + AFF_TAG;

interface ArticleDetailProps {
  article: Article;
  allArticles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, allArticles, onBack, onSelectArticle }) => {
  const categoryColors: Record<string, string> = {
    career: 'bg-blue-500',
    finance: 'bg-green-500',
    tech: 'bg-purple-500',
    style: 'bg-pink-500',
    wellness: 'bg-teal-500',
    lifestyle: 'bg-amber-500',
  };

  // Parse content and insert product links
  const renderContent = () => {
    const paragraphs = article.content.split('\n\n');
    const elements: React.ReactNode[] = [];
    
    paragraphs.forEach((paragraph, index) => {
      // Check if this paragraph contains a product link marker
      const productLink = article.productLinks.find(p => p.position === index + 1);
      
      if (paragraph.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-bold text-slate-800 mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      } else if (paragraph.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-slate-700 mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      } else if (paragraph.startsWith('[PRODUCT:')) {
        // Product recommendation box
        const productName = paragraph.match(/\[PRODUCT:(.*?)\]/)?.[1] || '';
        const link = article.productLinks.find(p => p.name === productName);
        elements.push(
          <div key={`product-${index}`} className="my-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <ExternalLink className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                  Recommended Product
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{productName}</h4>
                <p className="text-sm text-slate-600 mb-3">
                  {paragraph.replace(/\[PRODUCT:.*?\]/, '').trim()}
                </p>
                <a 
                  href={link?.amazonUrl ? withTag(link.amazonUrl) : '#'}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  View on Amazon <ExternalLink size={16} />
                </a>
                <p className="text-xs text-slate-400 mt-2">[AFFILIATE LINK]</p>
              </div>
            </div>
          </div>
        );
      } else if (paragraph.trim()) {
        // Regular paragraph - check for inline product mentions
        let content = paragraph;
        article.productLinks.forEach(link => {
          if (content.includes(`[${link.keyword}]`)) {
            content = content.replace(
              `[${link.keyword}]`,
              `<a href="${withTag(link.amazonUrl)}" target="_blank" rel="noopener noreferrer nofollow" class="text-amber-600 hover:text-amber-700 font-medium underline decoration-amber-300 hover:decoration-amber-500">${link.keyword}</a><sup class="text-xs text-slate-400">[affiliate]</sup>`
            );
          }
        });
        
        elements.push(
          <p 
            key={`p-${index}`} 
            className="text-slate-600 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }

      // Insert ad section every 5 paragraphs
      if ((index + 1) % 8 === 0 && index < paragraphs.length - 1) {
        elements.push(
          <AdSection key={`ad-${index}`} variant={index % 2 === 0 ? 'full' : 'half'} />
        );
      }
    });

    return elements;
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Articles</span>
      </button>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${categoryColors[article.category]} px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide`}>
            {article.category}
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1">
            <Clock size={14} />
            {article.readTime} min read
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-xl text-slate-600 mb-6">{article.excerpt}</p>
        
        <div className="flex items-center justify-between py-4 border-y border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold">
              {article.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{article.author}</div>
              <div className="text-sm text-slate-500">{article.publishDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Top Ad Section */}
      <AdSection variant="full" />

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {renderContent()}
      </div>

      {/* Keywords/Tags */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Related Topics</h4>
        <div className="flex flex-wrap gap-2">
          {article.keywords.map((keyword, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 cursor-pointer transition-colors"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Sources & References</h4>
        <ul className="space-y-2">
          {article.sources.map((source, index) => (
            <li key={index} className="text-sm text-slate-500">
              [{index + 1}] {source}
            </li>
          ))}
        </ul>
      </div>

      {/* Related Articles Section */}
      <RelatedArticles 
        currentArticle={article}
        allArticles={allArticles}
        onSelectArticle={onSelectArticle}
      />

      {/* Bottom Ad Section */}
      <AdSection variant="half" />

      {/* Affiliate Disclosure */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-700 mb-2">Affiliate Disclosure</h4>
        <p className="text-sm text-slate-500">
          This article contains affiliate links. If you click on a link and make a purchase, we may receive a commission at no additional cost to you. All product recommendations are based on our editorial assessment and are not influenced by compensation. We only recommend products we believe will be valuable to our readers.
        </p>
      </div>
    </article>
  );
};

export default ArticleDetail;
