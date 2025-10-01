import { useNavigate } from 'react-router-dom';
import { Chrome as Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="text-8xl font-bold text-primary">404</div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription className="text-base mt-2">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Don't worry, you can find plenty of other things on our homepage or use the
            search to find what you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/')} variant="default">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button onClick={() => navigate('/products')} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
