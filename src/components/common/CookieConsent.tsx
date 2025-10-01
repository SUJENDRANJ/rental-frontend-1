import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const COOKIE_CONSENT_KEY = 'renthub-cookie-consent';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom">
      <Card className="max-w-4xl mx-auto p-4 sm:p-6 shadow-lg border-2">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">We value your privacy</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized content,
                and analyze our traffic. By clicking "Accept All", you consent to our use of
                cookies.{' '}
                <Link to="/privacy" className="underline hover:text-foreground">
                  Learn more
                </Link>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleAccept} size="sm" className="flex-1 sm:flex-initial">
                Accept All
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                Decline
              </Button>
              <Link to="/privacy" className="flex-1 sm:flex-initial">
                <Button variant="ghost" size="sm" className="w-full">
                  Customize
                </Button>
              </Link>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={handleDecline}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
