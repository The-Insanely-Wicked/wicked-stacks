export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'career' | 'style' | 'wellness' | 'tech' | 'finance' | 'lifestyle';
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  image: string;
  keywords: string[];
  metaDescription: string;
  sources: string[];
  productLinks: ProductLink[];
}

export interface ProductLink {
  name: string;
  keyword: string;
  amazonUrl: string;
  position: number; // paragraph number where product appears
}
