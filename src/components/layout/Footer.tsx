import { Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RentHub
            </h3>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for renting premium items from verified hosts. Quality guaranteed, community-driven.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Become a Host</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Safety</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Insurance</a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Categories</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Electronics</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gaming</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Photography</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Wearables</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Smart Home</a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Stay Updated</h4>
            <p className="text-xs text-muted-foreground">
              Subscribe to our newsletter for the latest product updates and exclusive deals.
            </p>
            <div className="flex flex-col space-y-2">
              <Input placeholder="Enter your email" className="text-sm" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-muted-foreground">
            © 2025 RentHub. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};