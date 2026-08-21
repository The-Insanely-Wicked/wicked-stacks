import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allArticles, categories, getArticleBySlug, getRelatedArticles, Article } from '@/data/allArticles';
import { AdSection } from './AdPlaceholder';
import AmazonProductLink, { ProductCallout } from './AmazonProductLink';
import NewsletterAdmin from './NewsletterAdmin';
import SocialShareButtons from './SocialShareButtons';
import CommentSection from './CommentSection';
import CommentAdmin from './CommentAdmin';
import AdminDashboard from './AdminDashboard';
import { supabase } from '@/lib/supabase';

interface ShareCounts {
  twitter: number;
  facebook: number;
  linkedin: number;
  pinterest: number;
  total: number;
}

const AppLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'unsubscribe'>('home');
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const [showAdmin, setShowAdmin] = useState(false);
  const [showCommentAdmin, setShowCommentAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  
  // Unsubscribe state
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<'loading' | 'success' | 'already' | 'error'>('loading');
  const [unsubscribeEmail, setUnsubscribeEmail] = useState('');
  const [unsubscribeError, setUnsubscribeError] = useState('');

  // Share counts state
  const [articleShareCounts, setArticleShareCounts] = useState<Record<string, ShareCounts>>({});
  const [currentArticleShares, setCurrentArticleShares] = useState<ShareCounts>({
    twitter: 0, facebook: 0, linkedin: 0, pinterest: 0, total: 0
  });

  // Comment counts state
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  // Fetch all share counts and comment counts on mount
  useEffect(() => {
    fetchAllShareCounts();
    fetchAllCommentCounts();
  }, []);

  // Fetch share counts for current article when viewing
  useEffect(() => {
    if (currentView === 'article' && currentArticle) {
      fetchArticleShareCounts(currentArticle.slug);
    }
  }, [currentView, currentArticle]);


  const fetchAllShareCounts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('article-shares', {
        body: { action: 'getBulk' }
      });

      if (error) throw error;
      if (data.success && data.shares) {
        setArticleShareCounts(data.shares);
      }
    } catch (err) {
      console.error('Error fetching share counts:', err);
    }
  };

  const fetchArticleShareCounts = async (slug: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('article-shares', {
        body: { action: 'get', articleSlug: slug }
      });

      if (error) throw error;
      if (data.success && data.shares) {
        setCurrentArticleShares(data.shares);
        // Also update the global counts
        setArticleShareCounts(prev => ({
          ...prev,
          [slug]: data.shares
        }));
      }
    } catch (err) {
      console.error('Error fetching article share counts:', err);
    }
  };

  const handleShareComplete = (platform: string, newCount: number) => {
    if (currentArticle) {
      const updatedShares = {
        ...currentArticleShares,
        [platform]: newCount,
        total: currentArticleShares.total + 1
      };
      setCurrentArticleShares(updatedShares);
      setArticleShareCounts(prev => ({
        ...prev,
        [currentArticle.slug]: updatedShares
      }));
    }
  };

  // Fetch all comment counts
  const fetchAllCommentCounts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('article-comments', {
        body: { action: 'getCounts' }
      });

      if (error) throw error;
      if (data.success && data.counts) {
        setCommentCounts(data.counts);
      }
    } catch (err) {
      console.error('Error fetching comment counts:', err);
    }
  };

  // Handle comment added - update counts
  const handleCommentAdded = (articleSlug: string) => {
    setCommentCounts(prev => ({
      ...prev,
      [articleSlug]: (prev[articleSlug] || 0) + 1
    }));
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const unsubscribeToken = urlParams.get('unsubscribe');
    
    if (unsubscribeToken) {
      setCurrentView('unsubscribe');
      handleUnsubscribe(unsubscribeToken);
    }
  }, []);


  const handleUnsubscribe = async (token: string) => {
    setUnsubscribeStatus('loading');
    setUnsubscribeError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-unsubscribe', {
        body: { token }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setUnsubscribeEmail(data.email || '');
      
      if (data.alreadyUnsubscribed) {
        setUnsubscribeStatus('already');
      } else {
        setUnsubscribeStatus('success');
      }
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      setUnsubscribeError(err.message || 'Failed to process unsubscribe request.');
      setUnsubscribeStatus('error');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const filteredArticles = useMemo(() => {
    let articles = selectedCategory === 'All' 
      ? allArticles 
      : allArticles.filter(a => a.category === selectedCategory);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    }
    
    return articles;
  }, [selectedCategory, searchQuery]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(allArticles.map(a => a.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.slug}`);
  };

  // Keep the view in sync with the URL so every article has a real address
  useEffect(() => {
    if (routeSlug) {
      const a = getArticleBySlug(routeSlug);
      if (a) {
        setCurrentArticle(a);
        setCurrentView('article');
        window.scrollTo(0, 0);
      }
    } else if (currentView === 'article') {
      setCurrentView('home');
      setCurrentArticle(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSlug]);

  useEffect(() => {
    document.title = currentView === 'article' && currentArticle
      ? `${currentArticle.title} | WomanWise`
      : 'WomanWise — Career, Confidence & Life for Women';
  }, [currentView, currentArticle]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    setSubscribeError('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email, firstName: firstName || undefined }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setSubscribed(true);
      setEmail('');
      setFirstName('');
    } catch (err: any) {
      setSubscribeError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };



  const renderArticleContent = (content: string, amazonProducts: Article['amazonProducts']) => {
    let processedContent = content;
    
    amazonProducts.forEach(product => {
      const placeholder = `[AMAZON: ${product.name}]`;
      const link = `<amazon-link name="${product.name}" keyword="${product.keyword}"></amazon-link>`;
      processedContent = processedContent.replace(placeholder, link);
    });

    const paragraphs = processedContent.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-bold text-stone-800 mt-8 mb-4">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }

      if (paragraph.includes('<amazon-link')) {
        const parts = paragraph.split(/(<amazon-link[^>]+><\/amazon-link>)/);
        return (
          <p key={index} className="text-stone-700 leading-relaxed mb-4">
            {parts.map((part, i) => {
              const match = part.match(/name="([^"]+)" keyword="([^"]+)"/);
              if (match) {
                return (
                  <AmazonProductLink key={i} productName={match[1]} keyword={match[2]}>
                    {match[1]}
                  </AmazonProductLink>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }

      return (
        <p key={index} className="text-stone-700 leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  // Render unsubscribe confirmation page
  if (currentView === 'unsubscribe') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        {/* Header */}
        {/* Header */}
        <header className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center">
            <h1 
              onClick={handleBackToHome}
              className="text-2xl font-serif font-bold text-stone-800 cursor-pointer hover:text-rose-600 transition-colors"
            >
              WomanWise
            </h1>
          </div>
        </header>

        {/* Unsubscribe Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full">
            {unsubscribeStatus === 'loading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
                <p className="text-stone-600">Processing your unsubscribe request...</p>
              </div>
            )}

            {unsubscribeStatus === 'success' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                  You've Been Unsubscribed
                </h2>
                <p className="text-stone-600 mb-6">
                  {unsubscribeEmail && (
                    <span className="block mb-2">
                      <strong>{unsubscribeEmail}</strong> has been removed from our mailing list.
                    </span>
                  )}
                  We're sorry to see you go. You will no longer receive emails from WomanWise.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleBackToHome}
                    className="w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-700 transition-colors"
                  >
                    Return to Homepage
                  </button>
                  <p className="text-sm text-stone-500">
                    Changed your mind? You can always subscribe again from our homepage.
                  </p>
                </div>
              </div>
            )}

            {unsubscribeStatus === 'already' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                  Already Unsubscribed
                </h2>
                <p className="text-stone-600 mb-6">
                  {unsubscribeEmail && (
                    <span className="block mb-2">
                      <strong>{unsubscribeEmail}</strong>
                    </span>
                  )}
                  This email address was already unsubscribed from our newsletter.
                </p>
                <button
                  onClick={handleBackToHome}
                  className="w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-700 transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            )}

            {unsubscribeStatus === 'error' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                  Unsubscribe Failed
                </h2>
                <p className="text-stone-600 mb-2">
                  We couldn't process your unsubscribe request.
                </p>
                {unsubscribeError && (
                  <p className="text-red-600 text-sm mb-6 bg-red-50 p-3 rounded-lg">
                    {unsubscribeError}
                  </p>
                )}
                <div className="space-y-3">
                  <button
                    onClick={handleBackToHome}
                    className="w-full px-6 py-3 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-700 transition-colors"
                  >
                    Return to Homepage
                  </button>
                  <p className="text-sm text-stone-500">
                    If you continue to receive emails, please contact us directly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simple Footer */}
        <footer className="bg-stone-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-stone-400 text-sm">© 2026 WomanWise. All rights reserved. As an Amazon Associate we earn from qualifying purchases.</p>
          </div>
        </footer>
      </div>
    );
  }


  if (currentView === 'article' && currentArticle) {

    const relatedArticles = getRelatedArticles(currentArticle, 3);
    
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-stone-600 hover:text-rose-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Articles
            </button>
            <h1 
              onClick={handleBackToHome}
              className="text-2xl font-serif font-bold text-stone-800 cursor-pointer hover:text-rose-600 transition-colors"
            >
              WomanWise
            </h1>
            <div className="w-24"></div>

          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full mb-4">
              {currentArticle.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4 leading-tight">
              {currentArticle.title}
            </h1>
            <p className="text-xl text-stone-600 mb-6">{currentArticle.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>By {currentArticle.author}</span>
              <span>•</span>
              <span>{currentArticle.date}</span>
              <span>•</span>
              <span>{currentArticle.readTime}</span>
            </div>
          </div>

          <img 
            src={currentArticle.image} 
            alt={currentArticle.title}
            className="w-full h-96 object-cover rounded-2xl mb-8"
          />

          {/* Social Share Buttons */}
          <div className="mb-8">
            <SocialShareButtons
              articleSlug={currentArticle.slug}
              articleTitle={currentArticle.title}
              articleExcerpt={currentArticle.excerpt}
              articleImage={currentArticle.image}
              shareCounts={currentArticleShares}
              onShareComplete={handleShareComplete}
            />
          </div>

          {/* Ad Section */}
          <AdSection variant="half" />

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            {renderArticleContent(currentArticle.content, currentArticle.amazonProducts)}
          </div>


          {/* Featured Products */}
          <div className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Featured Products from This Article
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentArticle.amazonProducts.map((product, index) => (
                <ProductCallout 
                  key={index}
                  productName={product.name}
                  keyword={product.keyword}
                  description={product.context}
                />
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="mt-12 p-6 bg-stone-100 rounded-xl">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Sources & References</h3>
            <ul className="space-y-2">
              {currentArticle.sources.map((source, index) => (
                <li key={index} className="text-sm text-stone-600">{source}</li>
              ))}
            </ul>
          </div>

          {/* Ad Section */}
          <AdSection variant="full" />

          {/* Comment Section */}
          <div className="mt-12">
            <CommentSection
              articleId={currentArticle.slug}
              articleTitle={currentArticle.title}
              onCommentAdded={() => handleCommentAdded(currentArticle.slug)}
            />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map(article => (
                  <div 
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <span className="text-xs text-rose-600 font-medium">{article.category}</span>
                      <h4 className="font-semibold text-stone-800 mt-1 line-clamp-2">{article.title}</h4>
                      {commentCounts[article.slug] > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-stone-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {commentCounts[article.slug]} comments
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Footer */}
        <footer className="bg-stone-800 text-white py-16 mt-16">


          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-serif font-bold mb-4">Woman<span className="italic text-rose-400">Wise</span></h2>
                <p className="text-stone-400 mb-4">
                  Empowering professional women with insights on career, wellness, finance, and lifestyle.
                </p>
                <p className="text-xs text-stone-500">
                  As an Amazon Associate, we earn from qualifying purchases.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <ul className="space-y-2 text-stone-400">
                  <li className="hover:text-white cursor-pointer">Career & Leadership</li>
                  <li className="hover:text-white cursor-pointer">Finance & Investing</li>
                  <li className="hover:text-white cursor-pointer">Health & Wellness</li>
                  <li className="hover:text-white cursor-pointer">Beauty & Skincare</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-stone-400">
                  <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer">Terms of Service</li>
                  <li className="hover:text-white cursor-pointer">Affiliate Disclosure</li>
                  <li className="hover:text-white cursor-pointer">Contact Us</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-stone-700 mt-12 pt-8 text-center text-stone-500 text-sm">
              © 2026 WomanWise. All rights reserved. As an Amazon Associate we earn from qualifying purchases.
            </div>
          </div>
        </footer>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold text-stone-800">Woman<span className="italic text-rose-600">Wise</span></h1>
            <div className="hidden md:flex items-center gap-6">

              <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
                <a href="#" className="hover:text-rose-600 transition-colors">Career</a>
                <a href="#" className="hover:text-rose-600 transition-colors">Finance</a>
                <a href="#" className="hover:text-rose-600 transition-colors">Wellness</a>
                <a href="#" className="hover:text-rose-600 transition-colors">Beauty</a>
                <a href="#" className="hover:text-rose-600 transition-colors">Lifestyle</a>
              </nav>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent w-48 md:w-64"
              />
              <svg className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 via-white to-amber-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-rose-100 text-rose-700 text-sm font-medium rounded-full mb-4">
                For the Modern Professional Woman
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6 leading-tight">
                Insights for Women Who Lead, Invest & Thrive
              </h2>
              <p className="text-lg text-stone-600 mb-8">
                Expert-backed articles on career advancement, financial independence, wellness, and lifestyle—curated for ambitious women building lives of purpose and prosperity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-700 transition-colors"
                >
                  Explore Articles
                </button>
                <button className="px-8 py-3 border-2 border-stone-300 text-stone-700 font-medium rounded-full hover:border-rose-600 hover:text-rose-600 transition-colors">
                  Subscribe Free
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={allArticles[0].image}
                alt="Professional woman"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs">
                <p className="text-sm font-medium text-stone-800">25+ In-Depth Articles</p>
                <p className="text-xs text-stone-500">Expert insights on career, finance & wellness</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <AdSection variant="full" />

      {/* Featured Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allArticles.slice(0, 3).map(article => {
              const shares = articleShareCounts[article.slug];
              return (
                <div 
                  key={article.id}
                  className="group cursor-pointer"
                >
                  <div 
                    onClick={() => handleArticleClick(article)}
                    className="relative overflow-hidden rounded-2xl mb-4"
                  >
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-rose-600 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                    {shares && shares.total > 0 && (
                      <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-stone-600 text-xs font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          {shares.total}
                        </span>
                      </div>
                    )}
                  </div>
                  <div onClick={() => handleArticleClick(article)}>
                    <h3 className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-rose-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <SocialShareButtons
                      articleSlug={article.slug}
                      articleTitle={article.title}
                      articleExcerpt={article.excerpt}
                      articleImage={article.image}
                      shareCounts={shares}
                      variant="compact"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Ad Section */}
      <AdSection variant="half" />

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-rose-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Join 50,000+ Women Building Extraordinary Lives
          </h2>
          <p className="text-rose-100 mb-8">
            Get weekly insights on career growth, wealth building, and wellness delivered to your inbox.
          </p>
          {subscribed ? (
            <div className="bg-white/20 backdrop-blur rounded-xl p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-white font-medium">Thank you for subscribing!</p>
              <p className="text-rose-100 text-sm mt-2">Check your inbox for a welcome email.</p>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 px-6 py-3 rounded-full text-stone-800 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-6 py-3 rounded-full text-stone-800 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>
                {subscribeError && (
                  <p className="text-white bg-red-500/30 px-4 py-2 rounded-lg text-sm">{subscribeError}</p>
                )}
                <button 
                  type="submit"
                  disabled={subscribing}
                  className="w-full sm:w-auto px-8 py-3 bg-stone-800 text-white font-medium rounded-full hover:bg-stone-900 transition-colors disabled:opacity-50"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe Free'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>



      {/* All Articles */}
      <section id="articles" className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-3xl font-serif font-bold text-stone-800">All Articles</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.slice(0, 8).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-stone-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => {
              const shares = articleShareCounts[article.slug];
              return (
                <React.Fragment key={article.id}>
                  <div 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div onClick={() => handleArticleClick(article)} className="relative">
                      <img 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      {shares && shares.total > 0 && (
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur text-stone-600 text-xs font-medium rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {shares.total}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div onClick={() => handleArticleClick(article)}>
                        <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full mb-3">
                          {article.category}
                        </span>
                        <h3 className="text-lg font-semibold text-stone-800 mb-2 line-clamp-2 hover:text-rose-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-stone-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-stone-500">
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <SocialShareButtons
                            articleSlug={article.slug}
                            articleTitle={article.title}
                            articleExcerpt={article.excerpt}
                            articleImage={article.image}
                            shareCounts={shares}
                            variant="compact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Insert ad sections between articles */}
                  {(index + 1) % 6 === 0 && index < filteredArticles.length - 1 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <AdSection variant={index % 12 === 5 ? 'full' : 'half'} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>


          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Ad Section */}
      <AdSection variant="full" />

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-serif font-bold mb-4">Woman<span className="italic text-rose-400">Wise</span></h2>
              <p className="text-stone-400 mb-4 max-w-md">
                Empowering professional women with expert insights on career advancement, financial independence, wellness, and lifestyle. Join our community of ambitious women building extraordinary lives.
              </p>
              <p className="text-xs text-stone-500">
                As an Amazon Associate, we earn from qualifying purchases. This helps support our content creation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Popular Categories</h3>
              <ul className="space-y-2 text-stone-400">
                <li className="hover:text-white cursor-pointer transition-colors">Career & Leadership</li>
                <li className="hover:text-white cursor-pointer transition-colors">Finance & Investing</li>
                <li className="hover:text-white cursor-pointer transition-colors">Health & Wellness</li>
                <li className="hover:text-white cursor-pointer transition-colors">Beauty & Skincare</li>
                <li className="hover:text-white cursor-pointer transition-colors">Fashion & Style</li>
                <li className="hover:text-white cursor-pointer transition-colors">Travel & Lifestyle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-stone-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-white cursor-pointer transition-colors">Advertise</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Affiliate Disclosure</li>
                <li 
                  onClick={() => setShowAdminDashboard(true)}
                  className="hover:text-white cursor-pointer transition-colors text-stone-500 text-xs mt-4 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Dashboard
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm">© 2026 WomanWise. All rights reserved. As an Amazon Associate we earn from qualifying purchases.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>


      {/* Unified Admin Dashboard Modal */}
      {showAdminDashboard && <AdminDashboard onClose={() => setShowAdminDashboard(false)} />}
      
      {/* Legacy Admin Panel Modal (kept for backward compatibility) */}
      {showAdmin && <NewsletterAdmin onClose={() => setShowAdmin(false)} />}
      
      {/* Legacy Comment Admin Modal (kept for backward compatibility) */}
      {showCommentAdmin && (
        <CommentAdminModal 
          onClose={() => setShowCommentAdmin(false)} 
        />
      )}
    </div>
  );
};

// Comment Admin Modal with authentication
const CommentAdminModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify password by making a test request
      const { data, error: fnError } = await supabase.functions.invoke('article-comments', {
        body: { action: 'adminGetStats', adminPassword: password }
      });

      if (fnError) throw fnError;
      if (data?.error === 'Unauthorized') throw new Error('Invalid password');
      if (data?.success) {
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-800">Comment Admin Login</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-stone-500 text-center">
            Default password: womanwise-admin-2024
          </p>

        </div>
      </div>
    );
  }

  return <CommentAdmin adminPassword={password} onClose={onClose} />;
};

export default AppLayout;
