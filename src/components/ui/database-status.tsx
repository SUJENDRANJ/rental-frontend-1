import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const DatabaseStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [tableCount, setTableCount] = useState<number>(0);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      setError(null);

      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        throw connectionError;
      }

      // Check if tables exist by trying to query each main table
      const tables = ['profiles', 'products', 'rentals', 'favorites', 'reviews', 'notifications'];
      let existingTables = 0;

      for (const table of tables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('count', { count: 'exact', head: true });
          
          if (!error) {
            existingTables++;
          }
        } catch (e) {
          // Table doesn't exist or no access
        }
      }

      setTableCount(existingTables);
      setConnectionStatus('connected');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to database');
      setConnectionStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Supabase Connection</span>
          </div>
          {getStatusBadge()}
        </div>

        {connectionStatus === 'connected' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Database Tables:</span>
              <span className="font-medium">{tableCount}/6 detected</span>
            </div>
            
            {tableCount < 6 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Some database tables are missing. Please run the migrations in your Supabase SQL editor.
                </AlertDescription>
              </Alert>
            )}

            {tableCount === 6 && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  All database tables are properly set up and accessible!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {connectionStatus === 'error' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Database connection failed:</p>
                <code className="text-xs bg-red-100 dark:bg-red-900 p-1 rounded">
                  {error}
                </code>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={checkConnection}>
            Test Connection
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://supabase.com/dashboard/project/wvudegowhsydejnjnxpm" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase
            </a>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Project URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
          <p><strong>Status:</strong> {connectionStatus === 'connected' ? 'Ready for use' : 'Needs setup'}</p>
        </div>
      </CardContent>
    </Card>
  );
};