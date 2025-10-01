import { useState } from 'react';
import { Bell, Check, Trash2, Filter, Calendar, Package, User, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAppSelector } from '../hooks';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'system' | 'host';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking Request',
    message: 'John Doe wants to rent your Wireless Headphones for 3 days starting Jan 20th.',
    timestamp: '2025-01-15T10:30:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received $299.99 for the rental of Gaming Console.',
    timestamp: '2025-01-14T15:45:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'system',
    title: 'Profile Verification Complete',
    message: 'Your KYC verification has been approved. You can now start hosting items.',
    timestamp: '2025-01-13T09:15:00Z',
    read: true,
    priority: 'high'
  },
  {
    id: '4',
    type: 'booking',
    title: 'Rental Reminder',
    message: 'Your rental of Professional Camera Lens starts tomorrow. Don\'t forget to pick it up!',
    timestamp: '2025-01-12T18:00:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: '5',
    type: 'host',
    title: 'New Review Received',
    message: 'Sarah left a 5-star review for your Fitness Watch rental.',
    timestamp: '2025-01-11T14:20:00Z',
    read: true,
    priority: 'low'
  }
];

export const Notifications = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'host':
        return <User className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Login Required</h1>
          <p className="text-muted-foreground">
            Please sign in to view your notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Stay updated with your rental activities
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${!notification.read ? 'bg-primary/10' : 'bg-muted'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};