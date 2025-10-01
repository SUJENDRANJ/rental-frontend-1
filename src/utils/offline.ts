import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online', {
        description: 'Your internet connection has been restored',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection', {
        description: 'Some features may not be available',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const queueOfflineAction = (action: () => Promise<void>, key: string) => {
  const queue = JSON.parse(localStorage.getItem('offline-queue') || '[]');
  queue.push({ action: action.toString(), key, timestamp: Date.now() });
  localStorage.setItem('offline-queue', JSON.stringify(queue));
};

export const processOfflineQueue = async () => {
  const queue = JSON.parse(localStorage.getItem('offline-queue') || '[]');

  if (queue.length === 0) return;

  const results = await Promise.allSettled(
    queue.map(async (item: { action: string; key: string }) => {
      const action = new Function(`return ${item.action}`)();
      return action();
    })
  );

  const failedActions = queue.filter((_: unknown, index: number) =>
    results[index].status === 'rejected'
  );

  localStorage.setItem('offline-queue', JSON.stringify(failedActions));

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  if (successCount > 0) {
    toast.success(`Synced ${successCount} pending actions`);
  }
};
