import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, Clock, User, Heart, Share2, ArrowLeft, CircleCheck as CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SkeletonProductDetail } from '../components/ui/skeleton-product-detail';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setSelectedProduct, toggleFavorite } from '../store/slices/productsSlice';
import { setCurrentRental } from '../store/slices/rentalSlice';
import { mockProducts } from '../data/products';
import { useToast } from '../hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { selectedProduct, favorites } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentRental } = useAppSelector((state) => state.rental);
  
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState<'days' | 'months' | 'years'>('days');
  const [customDays, setCustomDays] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        dispatch(setSelectedProduct(product));
      } else {
        navigate('/products');
      }
      setLoading(false);
    };

    loadProduct();
  }, [id, dispatch, navigate]);

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your favorites.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedProduct) {
      dispatch(toggleFavorite(selectedProduct.id));
      toast({
        title: favorites.includes(selectedProduct.id) ? "Removed from favorites" : "Added to favorites",
        description: favorites.includes(selectedProduct.id) 
          ? "Item removed from your favorites list" 
          : "Item added to your favorites list",
      });
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct || !startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * selectedProduct.price;
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to rent items.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Select Dates",
        description: "Please select start and end dates for your rental.",
        variant: "destructive",
      });
      return;
    }

    if (selectedProduct) {
      dispatch(setCurrentRental({
        productId: selectedProduct.id,
        startDate,
        endDate,
        rentalPeriod,
        customDays,
      }));
      
      toast({
        title: "Rental Request Submitted",
        description: "Your rental request has been submitted successfully!",
      });
    }
  };

  if (loading) {
    return <SkeletonProductDetail />;
  }

  if (!selectedProduct) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isFavorited = favorites.includes(selectedProduct.id);
  const images = selectedProduct.images || [selectedProduct.image];

  const handleRentNowClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to rent items.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Select Dates",
        description: "Please select start and end dates for your rental.",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * selectedProduct.price;

    navigate('/payment', {
      state: {
        productId: selectedProduct.id,
        startDate,
        endDate,
        totalDays,
        totalAmount
      }
    });
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[selectedImage]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-md border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {/* Add more mock images for demo */}
            {Array.from({ length: Math.max(0, 5 - images.length) }).map((_, index) => (
              <button
                key={`mock-${index}`}
                onClick={() => setSelectedImage(0)}
                className="aspect-square overflow-hidden rounded-md border-2 border-transparent bg-gray-100 flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground">+{index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {selectedProduct.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(selectedProduct.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  ({selectedProduct.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">{selectedProduct.description}</p>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${selectedProduct.price}</span>
              <span className="text-muted-foreground">/ day</span>
            </div>
            {selectedProduct.pricePerWeek && (
              <div className="text-sm text-muted-foreground">
                Weekly: ${selectedProduct.pricePerWeek} | Monthly: ${selectedProduct.pricePerMonth}
              </div>
            )}
          </div>

          {/* Owner Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedProduct.owner.avatar}
                  alt={selectedProduct.owner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{selectedProduct.owner.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {selectedProduct.owner.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Rental Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            {startDate && endDate && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Total Cost:</span>
                  <span className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="grid grid-cols-1 gap-3">
              {selectedProduct.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Host Policies</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Minimum rental period: {selectedProduct.minRentalDays} day(s)</p>
              <p>• Maximum rental period: {selectedProduct.maxRentalDays} day(s)</p>
              <p>• Cancellation: Free cancellation up to 24 hours before rental</p>
              <p>• Security deposit may be required</p>
              <p>• Late return fees apply after grace period</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleRentNowClick}
              disabled={!selectedProduct.inStock}
              className="flex-1"
              size="lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {selectedProduct.inStock ? 'Rent Now' : 'Out of Stock'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleFavoriteToggle}
              className="px-4"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="lg" className="px-4">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* About Host */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">About the Host</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={selectedProduct.owner.avatar}
                alt={selectedProduct.owner.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{selectedProduct.owner.name}</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedProduct.owner.rating}</span>
                    <span className="text-muted-foreground">(127 reviews)</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Host since 2023</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Experienced host with a passion for sharing quality items with the community. 
                  I take great care of my products and ensure they're always in perfect condition for renters.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Host
                  </Button>
                  <Button variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Map */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Location</h2>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={[selectedProduct.location.lat, selectedProduct.location.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[selectedProduct.location.lat, selectedProduct.location.lng]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.location.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{selectedProduct.location.address}, {selectedProduct.location.city}</span>
        </div>
      </div>
    </div>
  );
};