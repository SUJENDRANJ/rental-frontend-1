import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { mockProducts } from '../../data/products';

interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchWithSuggestions = ({ 
  value, 
  onChange, 
  placeholder = "Search products...",
  className = ""
}: SearchWithSuggestionsProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim().length > 0) {
      // Get product name suggestions
      const productSuggestions = mockProducts
        .filter(product => 
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.category.toLowerCase().includes(value.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
        )
        .slice(0, 5)
        .map(product => product.name);

      // Get category suggestions
      const categorySuggestions = Array.from(new Set(
        mockProducts
          .filter(product => 
            product.category.toLowerCase().includes(value.toLowerCase())
          )
          .map(product => product.category)
      )).slice(0, 3);

      // Get tag suggestions
      const tagSuggestions = Array.from(new Set(
        mockProducts
          .flatMap(product => product.tags)
          .filter(tag => tag.toLowerCase().includes(value.toLowerCase()))
      )).slice(0, 3);

      const allSuggestions = [
        ...productSuggestions,
        ...categorySuggestions,
        ...tagSuggestions
      ].slice(0, 8);

      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => value.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors flex items-center space-x-2"
                >
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};