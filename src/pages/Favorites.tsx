import { useEffect, useMemo } from 'react';
import { Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setCurrentRental } from '../store/slices/rentalSlice';
import { mockProducts } from '../data/products';
import { useToast } from '../hooks/use-toast';

export const Favorites = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { favorites } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const favoriteProducts = useMemo(() => {
    return mockProducts.filter(product => favorites.includes(product.id));
  }, [favorites]);

  const handleRentNow = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to rent items.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    dispatch(setCurrentRental({
      productId,
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      rentalPeriod: 'days',
      customDays: 7,
    }));

    toast({
      title: "Rental Request Submitted",
      description: "Your rental request has been submitted successfully!",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view favorites</h1>
          <p className="text-muted-foreground">
            Please sign in to see your favorite items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          My Favorites
        </h1>
        <p className="text-muted-foreground">
          Items you've saved for later
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Heart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start browsing and add items to your favorites to see them here.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold">${product.price}</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => handleRentNow(product.id)}
                      disabled={!product.inStock}
                      className="flex-1"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Rent Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};