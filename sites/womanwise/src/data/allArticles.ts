import { Article, articles1 } from './articles-1';
import { articles2 } from './articles-2';
import { articles3 } from './articles-3';
import { articles4 } from './articles-4';
import { articles5 } from './articles-5';

export type { Article };

export const allArticles: Article[] = [
  ...articles1,
  ...articles2,
  ...articles3,
  ...articles4,
  ...articles5
];

export const categories = [
  'All',
  'Beauty & Skincare',
  'Career & Productivity',
  'Finance & Investing',
  'Wellness & Self-Care',
  'Fashion & Style',
  'Health & Wellness',
  'Career & Leadership',
  'Travel & Lifestyle',
  'Food & Entertaining',
  'Wellness & Mindfulness',
  'Finance & Legal',
  'Food & Nutrition',
  'Career & Networking',
  'Home & Lifestyle',
  'Career & Communication',
  'Fashion & Sustainability',
  'Finance & Retirement',
  'Wellness & Technology',
  'Art & Culture',
  'Career & Skills',
  'Career & Branding',
  'Finance & Independence',
  'Career & Life',
  'Beauty & Science'
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return allArticles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): Article[] => {
  if (category === 'All') return allArticles;
  return allArticles.filter(article => article.category === category);
};

export const getFeaturedArticles = (count: number = 3): Article[] => {
  return allArticles.slice(0, count);
};

export const getRelatedArticles = (currentArticle: Article, count: number = 3): Article[] => {
  return allArticles
    .filter(article => 
      article.id !== currentArticle.id && 
      article.category === currentArticle.category
    )
    .slice(0, count);
};
