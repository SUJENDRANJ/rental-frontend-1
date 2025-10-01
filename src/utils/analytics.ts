interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

class Analytics {
  private enabled: boolean;

  constructor() {
    this.enabled = import.meta.env.PROD;
  }

  track(event: AnalyticsEvent) {
    if (!this.enabled) {
      console.log('[Analytics - Dev]', event);
      return;
    }

    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          ...event.metadata,
        });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  pageView(path: string, title?: string) {
    if (!this.enabled) {
      console.log('[Analytics - Dev] Page View:', path, title);
      return;
    }

    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
          page_path: path,
          page_title: title,
        });
      }
    } catch (error) {
      console.error('Page view tracking error:', error);
    }
  }

  productView(productId: string, productName: string, price: number) {
    this.track({
      action: 'view_item',
      category: 'Product',
      label: productName,
      value: price,
      metadata: {
        product_id: productId,
        product_name: productName,
        price,
      },
    });
  }

  addToFavorites(productId: string, productName: string) {
    this.track({
      action: 'add_to_wishlist',
      category: 'Product',
      label: productName,
      metadata: {
        product_id: productId,
      },
    });
  }

  search(searchTerm: string, resultsCount: number) {
    this.track({
      action: 'search',
      category: 'Search',
      label: searchTerm,
      value: resultsCount,
      metadata: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    });
  }

  bookingStarted(productId: string, productName: string, price: number) {
    this.track({
      action: 'begin_checkout',
      category: 'Booking',
      label: productName,
      value: price,
      metadata: {
        product_id: productId,
      },
    });
  }

  bookingCompleted(
    bookingId: string,
    productId: string,
    totalAmount: number,
    paymentMethod: string
  ) {
    this.track({
      action: 'purchase',
      category: 'Booking',
      label: bookingId,
      value: totalAmount,
      metadata: {
        transaction_id: bookingId,
        product_id: productId,
        payment_method: paymentMethod,
      },
    });
  }

  signUp(method: string) {
    this.track({
      action: 'sign_up',
      category: 'Auth',
      label: method,
      metadata: {
        method,
      },
    });
  }

  login(method: string) {
    this.track({
      action: 'login',
      category: 'Auth',
      label: method,
      metadata: {
        method,
      },
    });
  }

  share(contentType: string, contentId: string, method: string) {
    this.track({
      action: 'share',
      category: 'Social',
      label: contentType,
      metadata: {
        content_type: contentType,
        content_id: contentId,
        method,
      },
    });
  }

  error(errorMessage: string, errorCode?: string) {
    this.track({
      action: 'exception',
      category: 'Error',
      label: errorMessage,
      metadata: {
        error_code: errorCode,
        fatal: false,
      },
    });
  }
}

export const analytics = new Analytics();
