import React, { useState, useMemo } from 'react';
import { Article } from '@/types/article';
import Header from './Header';
import Footer from './Footer';
import ArticleCard from './ArticleCard';
import ArticleDetail from './ArticleDetail';
import { AdSection } from './AdSpace';
import { articles1 } from '@/data/articles1';
import { articles2 } from '@/data/articles2';
import { articles3 } from '@/data/articles3';
import { articles4 } from '@/data/articles4';
import { articles5 } from '@/data/articles5';

const AppLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Combine all articles
  const allArticles = useMemo(() => [
    ...articles1,
    ...articles2,
    ...articles3,
    ...articles4,
    ...articles5
  ], []);

  // Filter articles based on category and search
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedArticle(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedArticle(null);
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  // Get featured article (first article or first in filtered list)
  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
      />

      <main>
        {selectedArticle ? (
          // Article Detail View
          <div className="max-w-7xl mx-auto px-4 py-8">
            <ArticleDetail 
              article={selectedArticle} 
              allArticles={allArticles}
              onBack={handleBackToList} 
              onSelectArticle={handleArticleSelect}
            />
          </div>
        ) : (
          // Article Listing View
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Success Starts With <span className="text-amber-400">Knowledge</span>
                  </h1>
                  <p className="text-xl text-slate-300 mb-8">
                    Expert insights on career, finance, style, and lifestyle for the ambitious modern man. 
                    Curated content to help you succeed in every aspect of life.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <span>25+ In-Depth Articles</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <span>Expert-Curated Content</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <span>Actionable Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Ad Section */}
            <div className="max-w-7xl mx-auto">
              <AdSection variant="full" />
            </div>

            {/* Featured Article */}
            {featuredArticle && (
              <section className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Article</h2>
                <ArticleCard 
                  article={featuredArticle} 
                  onSelect={handleArticleSelect}
                  featured={true}
                />
              </section>
            )}

            {/* Mid Ad Section */}
            <div className="max-w-7xl mx-auto">
              <AdSection variant="half" />
            </div>

            {/* Article Grid */}
            <section className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Articles`}
                </h2>
                <span className="text-slate-500">{filteredArticles.length} articles</span>
              </div>

              {remainingArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingArticles.map((article, index) => (
                    <React.Fragment key={article.id}>
                      <ArticleCard 
                        article={article} 
                        onSelect={handleArticleSelect}
                      />
                      {/* Insert ad section every 6 articles */}
                      {(index + 1) % 6 === 0 && index < remainingArticles.length - 1 && (
                        <div className="col-span-full">
                          <AdSection variant={index % 2 === 0 ? 'full' : 'half'} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No articles found matching your criteria.</p>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>

            {/* Bottom Ad Section */}
            <div className="max-w-7xl mx-auto">
              <AdSection variant="full" />
            </div>

            {/* Newsletter Section */}
            <section className="bg-gradient-to-r from-amber-500 to-orange-600 py-16">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Stay Ahead of the Curve</h2>
                <p className="text-amber-100 mb-8">
                  Get weekly insights on career, finance, and lifestyle delivered straight to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-amber-200 text-sm mt-4">No spam. Unsubscribe anytime.</p>
              </div>
            </section>

            {/* Categories Overview */}
            <section className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Explore by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { id: 'career', label: 'Career', icon: '💼', count: allArticles.filter(a => a.category === 'career').length },
                  { id: 'finance', label: 'Finance', icon: '📈', count: allArticles.filter(a => a.category === 'finance').length },
                  { id: 'tech', label: 'Tech', icon: '💻', count: allArticles.filter(a => a.category === 'tech').length },
                  { id: 'style', label: 'Style', icon: '👔', count: allArticles.filter(a => a.category === 'style').length },
                  { id: 'wellness', label: 'Wellness', icon: '🏋️', count: allArticles.filter(a => a.category === 'wellness').length },
                  { id: 'lifestyle', label: 'Lifestyle', icon: '🌟', count: allArticles.filter(a => a.category === 'lifestyle').length },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center group"
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{cat.label}</div>
                    <div className="text-sm text-slate-500">{cat.count} articles</div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
