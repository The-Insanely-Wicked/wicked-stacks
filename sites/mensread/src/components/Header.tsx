import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  selectedCategory: string;
}

const Header: React.FC<HeaderProps> = ({ onCategorySelect, onSearch, selectedCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'career', label: 'Career' },
    { id: 'finance', label: 'Finance' },
    { id: 'tech', label: 'Tech' },
    { id: 'style', label: 'Style' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MENS<span className="text-amber-500">READ</span></h1>
              <p className="text-xs text-slate-400">Success • Style • Substance</p>
            </div>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-64 placeholder-slate-400"
            />
            <button type="submit" className="ml-2 text-slate-400 hover:text-white">
              <Search size={18} />
            </button>
          </form>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <form onSubmit={handleSearch} className="flex items-center bg-slate-800 rounded-lg px-3 py-2 mb-4">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder-slate-400"
              />
              <button type="submit" className="ml-2 text-slate-400 hover:text-white">
                <Search size={18} />
              </button>
            </form>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategorySelect(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
