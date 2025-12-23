import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories
}: SearchAndFilterProps) {
  return (
    <div className="glass-effect rounded-3xl shadow-elegant p-8 mb-12 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl shadow-soft">
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-white">Search & Filter</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items, suppliers, descriptions..."
            className="w-full pl-14 pr-5 py-5 border-2 border-white/20 rounded-2xl focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 font-semibold text-lg shadow-soft"
          />
        </div>

        <div className="relative sm:w-64">
          <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-14 pr-5 py-5 border-2 border-white/20 rounded-2xl focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-300 appearance-none bg-white/10 backdrop-blur-sm text-white font-semibold text-lg shadow-soft"
          >
            <option value="" className="text-gray-900">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="text-gray-900">{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}