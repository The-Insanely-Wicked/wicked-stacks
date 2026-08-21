import React from 'react';
import { Article } from '@/types/article';
import { Clock, ChevronRight, Sparkles } from 'lucide-react';

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

interface ScoredArticle {
  article: Article;
  score: number;
  matchedKeywords: string[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticle,
  allArticles,
  onSelectArticle,
}) => {
  const categoryColors: Record<string, string> = {
    career: 'bg-blue-500',
    finance: 'bg-green-500',
    tech: 'bg-purple-500',
    style: 'bg-pink-500',
    wellness: 'bg-teal-500',
    lifestyle: 'bg-amber-500',
  };

  const categoryBgColors: Record<string, string> = {
    career: 'from-blue-50 to-blue-100 border-blue-200',
    finance: 'from-green-50 to-green-100 border-green-200',
    tech: 'from-purple-50 to-purple-100 border-purple-200',
    style: 'from-pink-50 to-pink-100 border-pink-200',
    wellness: 'from-teal-50 to-teal-100 border-teal-200',
    lifestyle: 'from-amber-50 to-amber-100 border-amber-200',
  };

  // Calculate relevance score for each article
  const calculateRelevance = (article: Article): ScoredArticle => {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Skip the current article
    if (article.id === currentArticle.id) {
      return { article, score: -1, matchedKeywords };
    }

    // Category matching - high weight (30 points for same category)
    if (article.category === currentArticle.category) {
      score += 30;
    }

    // Related categories - medium weight (15 points)
    const relatedCategories: Record<string, string[]> = {
      career: ['finance', 'lifestyle'],
      finance: ['career', 'lifestyle'],
      tech: ['career', 'lifestyle'],
      style: ['lifestyle', 'wellness'],
      wellness: ['lifestyle', 'style'],
      lifestyle: ['style', 'wellness', 'career'],
    };

    if (relatedCategories[currentArticle.category]?.includes(article.category)) {
      score += 15;
    }

    // Keyword matching - each shared keyword adds points
    const currentKeywords = new Set(currentArticle.keywords.map(k => k.toLowerCase()));
    
    article.keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (currentKeywords.has(lowerKeyword)) {
        score += 10; // 10 points per matching keyword
        matchedKeywords.push(keyword);
      }
    });

    // Partial keyword matching (words within keywords)
    const currentKeywordWords = new Set(
      currentArticle.keywords.flatMap(k => k.toLowerCase().split(' '))
    );
    
    article.keywords.forEach(keyword => {
      const words = keyword.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3 && currentKeywordWords.has(word) && !matchedKeywords.includes(keyword)) {
          score += 3; // 3 points for partial matches
        }
      });
    });

    // Title similarity - check for common significant words
    const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 'was', 'were', 'your', 'how', 'what', 'why', 'when', 'where', 'who', 'which', 'that', 'this', 'with']);
    
    const currentTitleWords = new Set(
      currentArticle.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(' ')
        .filter(w => w.length > 3 && !stopWords.has(w))
    );

    const articleTitleWords = article.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(w => w.length > 3 && !stopWords.has(w));

    articleTitleWords.forEach(word => {
      if (currentTitleWords.has(word)) {
        score += 5; // 5 points for title word matches
      }
    });

    // Author matching - slight bonus for same author
    if (article.author === currentArticle.author) {
      score += 5;
    }

    return { article, score, matchedKeywords };
  };

  // Get related articles sorted by relevance
  const getRelatedArticles = (): ScoredArticle[] => {
    const scoredArticles = allArticles
      .map(calculateRelevance)
      .filter(sa => sa.score > 0) // Exclude current article and zero-score articles
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Get top 4 related articles

    return scoredArticles;
  };

  const relatedArticles = getRelatedArticles();

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Related Articles</h3>
          <p className="text-sm text-slate-500">Continue reading similar content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedArticles.map(({ article, matchedKeywords }, index) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${categoryBgColors[article.category]}`}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`${categoryColors[article.category]} px-2.5 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide`}>
                  {article.category}
                </span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {article.readTime} min read
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors line-clamp-2">
                {article.title}
              </h4>

              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              {/* Matched Keywords */}
              {matchedKeywords.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1.5 font-medium">Related topics:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedKeywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white/70 text-slate-600 rounded-full text-xs border border-slate-200"
                      >
                        {keyword}
                      </span>
                    ))}
                    {matchedKeywords.length > 3 && (
                      <span className="px-2 py-0.5 bg-white/50 text-slate-500 rounded-full text-xs">
                        +{matchedKeywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  By {article.author}
                </span>
                <span className="text-amber-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* SEO-friendly text for related content */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-600">Discover more:</strong> These articles were selected based on shared topics including{' '}
          {currentArticle.keywords.slice(0, 5).join(', ')}. 
          Our content is designed to help ambitious professionals stay informed and make better decisions.
        </p>
      </div>
    </section>
  );
};

export default RelatedArticles;
