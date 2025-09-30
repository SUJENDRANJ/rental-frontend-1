import { useEffect } from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Pagination } from '../components/ui/pagination';
import { SkeletonCard } from '../components/ui/skeleton-card';
import { useAppSelector, useAppDispatch } from '../hooks';
import { 
  setProducts, 
  setLoading, 
  setSelectedCategory, 
  setCurrentPage, 
  setSortBy, 
  setSortOrder,
  setPriceRange,
  setSelectedFeatures,
  setAvailabilityFilter,
  setLocationFilter,
  setSearchTerm
} from '../store/slices/productsSlice';
import { mockProducts } from '../data/products';
import { useMemo } from 'react';

export const Products = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    loading,
    searchTerm,
    selectedCategory,
    currentPage,
    sortBy,
    sortOrder,
    priceRange,
    selectedFeatures,
    availabilityFilter,
    locationFilter
  } = useAppSelector((state) => state.products);

  const productsPerPage = 8;

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch(setProducts(mockProducts));
      dispatch(setLoading(false));
    };

    loadProducts();
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product =>
        selectedFeatures.some(feature => 
          product.features.some(pFeature => 
            pFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(product => 
        availabilityFilter === 'available' ? product.inStock : !product.inStock
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(product =>
        product.location.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        product.location.address.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, sortOrder, priceRange, selectedFeatures, availabilityFilter, locationFilter]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rent Premium Items</h1>
        <p className="text-muted-foreground">
          Discover and rent high-quality items from trusted hosts in your area
        </p>
      </div>

      <ProductFilters
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => dispatch(setSelectedCategory(category))}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(sort) => dispatch(setSortBy(sort))}
        onSortOrderChange={(order) => dispatch(setSortOrder(order))}
        totalProducts={filteredProducts.length}
        priceRange={priceRange}
        onPriceRangeChange={(range) => dispatch(setPriceRange(range))}
        selectedFeatures={selectedFeatures}
        onFeaturesChange={(features) => dispatch(setSelectedFeatures(features))}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={(availability) => dispatch(setAvailabilityFilter(availability))}
        locationFilter={locationFilter}
        onLocationChange={(location) => dispatch(setLocationFilter(location))}
        searchTerm={searchTerm}
        onSearchChange={(search) => dispatch(setSearchTerm(search))}
      />

      <ProductGrid products={currentProducts} loading={false} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />
    </div>
  );
};