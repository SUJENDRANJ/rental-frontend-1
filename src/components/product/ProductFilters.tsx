import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import { categories } from '../../data/products';
import { useState } from 'react';
import { SearchWithSuggestions } from '../ui/search-with-suggestions';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'name' | 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'price' | 'rating') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalProducts: number;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  selectedFeatures?: string[];
  onFeaturesChange?: (features: string[]) => void;
  availabilityFilter?: 'all' | 'available' | 'unavailable';
  onAvailabilityChange?: (availability: 'all' | 'available' | 'unavailable') => void;
  locationFilter?: string;
  onLocationChange?: (location: string) => void;
  searchTerm?: string;
  onSearchChange?: (search: string) => void;
}

const commonFeatures = [
  'Wireless',
  'Bluetooth',
  'Waterproof',
  'Fast Charging',
  'HD Quality',
  'Portable',
  'Professional Grade',
  'Energy Efficient'
];

export const ProductFilters = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  totalProducts,
  priceRange = [0, 1000],
  onPriceRangeChange,
  selectedFeatures = [],
  onFeaturesChange,
  availabilityFilter = 'all',
  onAvailabilityChange,
  locationFilter = '',
  onLocationChange,
  searchTerm = '',
  onSearchChange
}: ProductFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFeatureToggle = (feature: string) => {
    if (!onFeaturesChange) return;
    
    const updatedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    
    onFeaturesChange(updatedFeatures);
  };

  const clearAllFilters = () => {
    onCategoryChange('All');
    onPriceRangeChange?.([0, 1000]);
    onFeaturesChange?.([]);
    onAvailabilityChange?.('all');
    onLocationChange?.('');
    onSearchChange?.('');
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    priceRange[0] > 0 || priceRange[1] < 1000,
    selectedFeatures.length > 0,
    availabilityFilter !== 'all',
    locationFilter.length > 0,
    searchTerm.length > 0
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {onSearchChange && (
        <div className="max-w-md">
          <SearchWithSuggestions
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search products, categories, or tags..."
            className="w-full"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {totalProducts} products
          </span>
          {selectedCategory !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCategory}
              <button
                onClick={() => onCategoryChange('All')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchTerm}"
                <button
                  onClick={() => onSearchChange?.('')}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </Button>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'rating') => onSortChange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range (per day)</Label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => onPriceRangeChange?.(value as [number, number])}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <Label>Availability</Label>
                <Select value={availabilityFilter} onValueChange={(value: 'all' | 'available' | 'unavailable') => onAvailabilityChange?.(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="unavailable">Unavailable Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label>Location</Label>
                <Input
                  placeholder="Enter city or area"
                  value={locationFilter}
                  onChange={(e) => onLocationChange?.(e.target.value)}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label>Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm font-normal">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};