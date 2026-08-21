import React from 'react';
import { Article } from '@/types/article';
import { Clock, Tag, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect, featured = false }) => {
  const categoryColors: Record<string, string> = {
    career: 'bg-blue-500',
    finance: 'bg-green-500',
    tech: 'bg-purple-500',
    style: 'bg-pink-500',
    wellness: 'bg-teal-500',
    lifestyle: 'bg-amber-500',
  };

  if (featured) {
    return (
      <article 
        onClick={() => onSelect(article)}
        className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-video md:aspect-auto md:h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-6xl font-bold text-slate-600/50">{article.title.charAt(0)}</div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className={`${categoryColors[article.category]} px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide`}>
                {article.category}
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} min read
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
              {article.title}
            </h2>
            <p className="text-slate-400 mb-6 line-clamp-3">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                By <span className="text-slate-300">{article.author}</span> • {article.publishDate}
              </div>
              <span className="text-amber-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read More <ChevronRight size={18} />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      onClick={() => onSelect(article)}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <div className="text-4xl font-bold text-slate-400/50">{article.title.charAt(0)}</div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`${categoryColors[article.category]} px-2 py-0.5 rounded-full text-xs font-semibold text-white uppercase tracking-wide`}>
            {article.category}
          </span>
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Clock size={12} />
            {article.readTime} min
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{article.publishDate}</span>
          <span className="text-amber-500 font-medium flex items-center gap-1">
            Read <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
