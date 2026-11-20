import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { mockCategories } from '../../data/mockCourses';
import CourseCard from '../../components/cards/CourseCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

export const CourseDiscoveryPage = () => {
  const { courses, batches } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState('all'); // all, under-2500, 2500-4000, above-4000
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all'); // all, 4.5, 4.8
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, rating
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered courses logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Must be approved for public discovery
      if (course.status !== 'Approved') return false;

      // Search match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchDesc = course.shortDescription?.toLowerCase().includes(q);
        const matchInst = course.instructorName?.toLowerCase().includes(q);
        const matchCat = course.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchInst && !matchCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = mockCategories.find((c) => c.id === selectedCategory);
        if (catObj && course.category !== catObj.name) return false;
        if (!catObj && course.categoryId !== selectedCategory && course.category !== selectedCategory) return false;
      }

      // Price filter
      if (priceRange === 'under-2500' && course.price >= 2500) return false;
      if (priceRange === '2500-4000' && (course.price < 2500 || course.price > 4000)) return false;
      if (priceRange === 'above-4000' && course.price <= 4000) return false;

      // Language filter
      if (selectedLanguage !== 'all') {
        if (!course.language?.toLowerCase().includes(selectedLanguage.toLowerCase())) return false;
      }

      // Rating filter
      if (selectedRating === '4.8' && course.rating < 4.8) return false;
      if (selectedRating === '4.5' && course.rating < 4.5) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [courses, search, selectedCategory, priceRange, selectedLanguage, selectedRating, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSelectedLanguage('all');
    setSelectedRating('all');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    search || selectedCategory !== 'all' || priceRange !== 'all' || selectedLanguage !== 'all' || selectedRating !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <Badge variant="brand" size="sm" className="mb-2">
          Small-Batch Directory
        </Badge>
        <h1 className="text-3xl font-bold text-brand-900">
          Discover Live Interactive Cohorts
        </h1>
        <p className="text-sm text-content-muted mt-1 max-w-2xl">
          Every class is conducted live on video and capped at 10–15 students to ensure direct individual guidance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-edge shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by topic, skill, or instructor name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-edge text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-content-muted whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm font-medium text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="featured">Featured Cohorts</option>
              <option value="rating">Highest Rated (4.8+)</option>
              <option value="price-low">Fee: Low to High</option>
              <option value="price-high">Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-edge text-xs">
          {/* Categories */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-edge bg-surface-subtle font-medium text-brand-900"
          >
            <option value="all">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <select
            value={priceRange}
            onChange={(e) => {
              setPriceRange(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-edge bg-surface-subtle font-medium text-brand-900"
          >
            <option value="all">Any Fee</option>
            <option value="under-2500">Under ₹2,500</option>
            <option value="2500-4000">₹2,500 - ₹4,000</option>
            <option value="above-4000">₹4,000+</option>
          </select>

          {/* Language */}
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-edge bg-surface-subtle font-medium text-brand-900"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>

          {/* Rating */}
          <select
            value={selectedRating}
            onChange={(e) => {
              setSelectedRating(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-edge bg-surface-subtle font-medium text-brand-900"
          >
            <option value="all">All Ratings</option>
            <option value="4.8">4.8+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-brand-600 hover:text-brand-800 font-semibold ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Batch rule banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-content-muted">
        <p>
          Showing <strong className="text-brand-900">{filteredCourses.length}</strong> small-batch cohorts
        </p>
        <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-800 px-2.5 py-1 rounded-lg border border-brand-200 font-medium">
          <Users className="w-3.5 h-3.5 text-brand-600" />
          Platform Standard: Max 50 students / cohort (Default 10-15)
        </span>
      </div>

      {/* Courses Grid */}
      {paginatedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} course={course} batches={batches} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No live batches match your criteria"
          description="Try broadening your search keywords or resetting price and category filters."
          actionLabel="Clear All Filters"
          onAction={resetFilters}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            icon={ChevronLeft}
          >
            Previous
          </Button>
          <span className="text-xs font-semibold px-3 text-brand-900">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            iconRight={ChevronRight}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseDiscoveryPage;
