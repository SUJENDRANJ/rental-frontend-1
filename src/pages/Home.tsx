import { useEffect } from 'react';
import { Hero } from '../components/layout/Hero';
import { HomeBanners } from '../components/layout/HomeBanners';
import { SkeletonHero } from '../components/ui/skeleton-hero';
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

export const Home = () => {
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
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const productsPerPage = 8;

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(setLoading(true));
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1500));
        dispatch(setProducts(mockProducts));
      } catch (error) {
        console.error('Error loading products:', error);
        // Still show mock products if there's an error
        dispatch(setProducts(mockProducts));
      } finally {
        dispatch(setLoading(false));
      }
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

  return (
    <>
      {/* Hero Section */}
      {loading ? <SkeletonHero /> : <Hero />}

      {/* Banners Section */}
      <HomeBanners />

      {/* Featured Products Section */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="mb-8 space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Featured Rentals</h2>
              <p className="text-muted-foreground">
                Discover our hand-picked selection of premium items available for rent
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="flex items-center space-x-4">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-10 animate-pulse"></div>
              </div>
            </div>
          ) : (
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
          )}

          <ProductGrid products={currentProducts} loading={loading} />

          {loading ? (
            <div className="flex justify-center mt-8">
              <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          ) : (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => dispatch(setCurrentPage(page))}
            />
          )}
        </div>
      </section>
    </>
  );
};