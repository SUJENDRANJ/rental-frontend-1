import { useState } from 'react';
import { Calendar, Package, Clock, CircleCheck as CheckCircle, Circle as XCircle, Star, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAppSelector } from '../hooks';

interface RentalOrder {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  hostName: string;
  hostAvatar: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  orderDate: string;
  paymentMethod: string;
}

const mockRentals: RentalOrder[] = [
  {
    id: 'R001',
    productId: '1',
    productName: 'Wireless Bluetooth Headphones',
    productImage: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    hostName: 'John Smith',
    hostAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    startDate: '2025-01-15',
    endDate: '2025-01-22',
    totalDays: 7,
    pricePerDay: 299.99,
    totalAmount: 2099.93,
    status: 'active',
    orderDate: '2025-01-10',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'R002',
    productId: '2',
    productName: 'Professional Camera Lens',
    productImage: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    hostName: 'Mike Chen',
    hostAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    startDate: '2025-01-05',
    endDate: '2025-01-08',
    totalDays: 3,
    pricePerDay: 1299.99,
    totalAmount: 3899.97,
    status: 'completed',
    orderDate: '2025-01-01',
    paymentMethod: 'PayPal'
  },
  {
    id: 'R003',
    productId: '5',
    productName: 'Mechanical Gaming Keyboard',
    productImage: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800',
    hostName: 'Alex Rodriguez',
    hostAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    totalDays: 5,
    pricePerDay: 149.99,
    totalAmount: 749.95,
    status: 'confirmed',
    orderDate: '2025-01-12',
    paymentMethod: 'Credit Card'
  }
];

export const MyRentals = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'active':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'active':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filterRentals = (status: string) => {
    if (status === 'all') return mockRentals;
    return mockRentals.filter(rental => rental.status === status);
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Login Required</h1>
          <p className="text-muted-foreground">
            Please sign in to view your rentals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Package className="h-8 w-8" />
          My Rentals
        </h1>
        <p className="text-muted-foreground">
          Track and manage your rental orders
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterRentals(status).length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No rentals found</h3>
                <p className="text-muted-foreground">
                  {status === 'all' 
                    ? "You haven't made any rentals yet." 
                    : `No ${status} rentals at the moment.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filterRentals(status).map((rental) => (
                  <Card key={rental.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={rental.productImage}
                          alt={rental.productName}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{rental.productName}</h3>
                              <p className="text-sm text-muted-foreground">Order #{rental.id}</p>
                            </div>
                            <Badge variant={getStatusColor(rental.status) as any} className="flex items-center gap-1">
                              {getStatusIcon(rental.status)}
                              {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <img
                              src={rental.hostAvatar}
                              alt={rental.hostName}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-muted-foreground">
                              Hosted by {rental.hostName}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Rental Period:</span>
                              <div className="font-medium">
                                {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                              </div>
                              <div className="text-muted-foreground">{rental.totalDays} days</div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Daily Rate:</span>
                              <div className="font-medium">${rental.pricePerDay}</div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Total Amount:</span>
                              <div className="font-bold text-lg">${rental.totalAmount}</div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Payment:</span>
                              <div className="font-medium">{rental.paymentMethod}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Ordered on {new Date(rental.orderDate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Host
                          </Button>
                          
                          {rental.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-2" />
                              Rate & Review
                            </Button>
                          )}
                          
                          {rental.status === 'pending' && (
                            <Button variant="destructive" size="sm">
                              Cancel Order
                            </Button>
                          )}
                          
                          <Button size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};