import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  'how to rent': 'To rent an item: 1) Browse products, 2) Select dates, 3) Click "Rent Now", 4) Complete payment. You can track your rentals in "My Rentals".',
  'payment': 'We accept payments through Razorpay (UPI, Cards, Netbanking). All transactions are secure and encrypted.',
  'become host': 'To become a host: 1) Go to your profile, 2) Complete KYC verification, 3) Start listing your items. You can track earnings in the Host Dashboard.',
  'cancel': 'To cancel a rental, go to "My Rentals", find your booking, and click "Cancel". Refund depends on the cancellation policy.',
  'support': 'For support, email us at support@renthub.com or use the contact form. We respond within 24 hours.',
  'refund': 'Refunds are processed within 5-7 business days after cancellation approval. The amount will be credited to your original payment method.',
  'kyc': 'KYC verification requires: 1) Government ID proof, 2) Address proof, 3) Selfie video. Process takes 1-2 business days.',
  'pricing': 'Rental prices are set by hosts. You can filter by price range to find items within your budget.',
  'location': 'Use the location filter to find items near you. We show items within your selected area.',
  'categories': 'Browse by categories: Electronics, Tools, Sports, Vehicles, Party Supplies, Furniture, Cameras, and more.',
};

const getResponseForQuery = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerQuery.includes(keyword)) {
      return response;
    }
  }

  return "I'm here to help! Common questions include: How to rent items, Payment methods, Becoming a host, Cancellations, KYC verification, and Support contact. What would you like to know?";
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m RentHub Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponseForQuery(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickActions = [
    'How to rent?',
    'Become a host',
    'Payment methods',
    'Support contact',
  ];

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">RentHub Assistant</h3>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {messages.length <= 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  Quick actions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInputValue(action);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="text-xs h-auto py-2"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
