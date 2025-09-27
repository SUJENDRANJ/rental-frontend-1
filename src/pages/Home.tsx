import { useEffect } from 'react';
import { Hero } from '../components/layout/Hero';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Pagination } from '../components/ui/pagination';
import { useAppSelector, useAppDispatch } from '../hooks';
import { 
  setProducts, 
  setLoading, 
  setSearchTerm, 
  setSelectedCategory, 
  setCurrentPage, 
  setSortBy, 
  setSortOrder 
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
    sortOrder
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
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Featured Rentals</h2>
            <p className="text-muted-foreground">
              Discover our hand-picked selection of premium items available for rent
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
          />

          <ProductGrid products={currentProducts} loading={loading} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
          />
        </div>
      </section>
    </>
  );
};