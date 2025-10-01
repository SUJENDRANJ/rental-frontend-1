import { ArrowRight, Star, Shield, Clock, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export const HomeBanners = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Feature Banner */}
        <div className="mb-16">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 text-white">
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-0">
                    🎉 Limited Time Offer
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Get 50% Off Your First Rental
                  </h2>
                  <p className="text-lg mb-6 text-blue-100">
                    Join thousands of happy renters and discover premium items at unbeatable prices. 
                    Perfect for trying before buying or occasional use.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" variant="secondary" className="group">
                      Start Renting Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="relative h-64 lg:h-auto">
                  <img
                    src="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Happy customers using rented items"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">100% Secure</h3>
            <p className="text-sm text-muted-foreground">
              All transactions are protected with bank-level security
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Get help anytime with our dedicated support team
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold mb-2">Top Rated</h3>
            <p className="text-sm text-muted-foreground">
              4.9/5 rating from over 10,000 satisfied customers
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Instant Booking</h3>
            <p className="text-sm text-muted-foreground">
              Book items instantly with our streamlined process
            </p>
          </Card>
        </div>

        {/* Host Banner */}
        <Card className="overflow-hidden bg-gradient-to-r from-green-500 to-teal-600">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto order-2 lg:order-1">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Person earning money as a host"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12 text-white order-1 lg:order-2">
                <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-0">
                  💰 Earn Extra Income
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Become a Host Today
                </h2>
                <p className="text-lg mb-6 text-green-100">
                  Turn your unused items into income. Join our community of hosts 
                  and start earning money from things you already own.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm">Earn up to $500/month per item</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm">Full insurance coverage included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm">Easy setup in under 10 minutes</span>
                  </div>
                </div>
                <Button size="lg" variant="secondary" className="group">
                  Start Hosting
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};