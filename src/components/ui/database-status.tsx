import { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, Loader as Loader2 } from 'lucide-react';
import { Badge } from './badge';
import { supabase } from '@/lib/supabase';

type ConnectionStatus = 'checking' | 'connected' | 'disconnected' | 'error';

interface DatabaseStatusProps {
  showDetails?: boolean;
}

export const DatabaseStatus = ({ showDetails = false }: DatabaseStatusProps) => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setStatus('checking');

      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
        .maybeSingle();

      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setStatus('disconnected');
          setDetails('Database tables not found. Please run migrations.');
        } else {
          setStatus('error');
          setDetails(error.message);
        }
      } else {
        setStatus('connected');
        setDetails('Database is connected and ready.');
      }
    } catch (err) {
      setStatus('error');
      setDetails('Failed to connect to database. Check your credentials.');
      console.error('Database connection error:', err);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'checking':
        return 'secondary';
      case 'connected':
        return 'default';
      case 'disconnected':
      case 'error':
        return 'destructive';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Not Connected';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant={getStatusVariant()} className="gap-1.5">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        {status !== 'checking' && status !== 'connected' && (
          <button
            onClick={checkConnection}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Retry
          </button>
        )}
      </div>
      {showDetails && details && (
        <p className="text-xs text-muted-foreground">{details}</p>
      )}
    </div>
  );
};
