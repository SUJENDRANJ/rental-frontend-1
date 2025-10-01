import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin, DollarSign, Package, Loader as Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setProducts } from '../store/slices/productsSlice';
import { categories } from '../data/products';
import { productService } from '../services/productService';
import { supabase } from '../lib/supabase';

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { products } = useAppSelector((state) => state.products);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    pricePerWeek: '',
    pricePerMonth: '',
    stockCount: '1',
    minRentalDays: '1',
    maxRentalDays: '30',
    features: '',
    tags: '',
    address: '',
    city: '',
    country: 'USA'
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (formData.features.trim() && !selectedFeatures.includes(formData.features.trim())) {
      setSelectedFeatures(prev => [...prev, formData.features.trim()]);
      setFormData(prev => ({ ...prev, features: '' }));
    }
  };

  const removeFeature = (feature: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== feature));
  };

  const addTag = () => {
    if (formData.tags.trim() && !selectedTags.includes(formData.tags.trim())) {
      setSelectedTags(prev => [...prev, formData.tags.trim()]);
      setFormData(prev => ({ ...prev, tags: '' }));
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImageFiles(prev => [...prev, ...fileArray]);

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) {
      return ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'];
    }

    const imageUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          console.warn('Storage upload error:', uploadError);
          return ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'];
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      return imageUrls.length > 0 ? imageUrls : ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'];
    } catch (error) {
      console.error('Image upload failed:', error);
      return ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || user?.role !== 'host') {
      toast({
        title: "Access Denied",
        description: "You must be signed in as a host to create products.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        price_per_week: formData.pricePerWeek ? parseFloat(formData.pricePerWeek) : null,
        price_per_month: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : null,
        category: formData.category,
        in_stock: true,
        stock_count: parseInt(formData.stockCount),
        min_rental_days: parseInt(formData.minRentalDays),
        max_rental_days: parseInt(formData.maxRentalDays),
        features: selectedFeatures,
        tags: selectedTags,
        images: imageUrls,
        location_address: formData.address || null,
        location_city: formData.city || null,
        location_country: formData.country,
        location_lat: null,
        location_lng: null,
        owner_id: user!.id,
      };

      await productService.createProduct(productData);

      const updatedProducts = await productService.getProducts();
      dispatch(setProducts(updatedProducts));

      toast({
        title: "Product Created Successfully!",
        description: "Your product has been added to the marketplace.",
      });

      navigate('/host/dashboard');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error Creating Product",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'host') {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Host Access Required</h1>
          <p className="text-muted-foreground">
            Please sign in as a host to create products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/host/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Create New Product</h1>
        <p className="text-muted-foreground">
          Add a new item to your rental inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== 'All').map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product in detail"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockCount">Stock Count</Label>
                <Input
                  id="stockCount"
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => handleInputChange('stockCount', e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minRentalDays">Min Rental Days</Label>
                <Input
                  id="minRentalDays"
                  type="number"
                  value={formData.minRentalDays}
                  onChange={(e) => handleInputChange('minRentalDays', e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxRentalDays">Max Rental Days</Label>
                <Input
                  id="maxRentalDays"
                  type="number"
                  value={formData.maxRentalDays}
                  onChange={(e) => handleInputChange('maxRentalDays', e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Daily Rate ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerWeek">Weekly Rate ($)</Label>
                <Input
                  id="pricePerWeek"
                  type="number"
                  step="0.01"
                  value={formData.pricePerWeek}
                  onChange={(e) => handleInputChange('pricePerWeek', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerMonth">Monthly Rate ($)</Label>
                <Input
                  id="pricePerMonth"
                  type="number"
                  step="0.01"
                  value={formData.pricePerMonth}
                  onChange={(e) => handleInputChange('pricePerMonth', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features & Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="features">Add Features</Label>
              <div className="flex gap-2">
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="Enter a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(feature)}>
                    {feature} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Add Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Enter a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload Product Images</h3>
              <p className="text-muted-foreground mb-4">
                Add high-quality photos of your product. First image will be the main photo.
              </p>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                Choose Files
              </Button>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2">Main Image</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Product...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/host/dashboard')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};