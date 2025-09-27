import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categories } from '../../data/products';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'name' | 'price' | 'rating';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'price' | 'rating') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalProducts: number;
}

export const ProductFilters = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  totalProducts
}: ProductFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
              ×
            </button>
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-4">
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
  );
};