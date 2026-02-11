import { useEffect, useState } from 'react';

declare global {
  type TelegramWebApp = {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        BackButton: {
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        SecureStorage: {
          setItem: (key: string, value: string, callback?: (error: string | null, success: boolean) => void) => void;
          getItem: (key: string, callback: (error: string | null, value: string) => void) => void;
          removeItem: (key: string, callback?: (error: string | null, success: boolean) => void) => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);
    }
  }, []);

  return { webApp };
};

export const useTelegramSecureStorage = () => {
  const { webApp } = useTelegramWebApp();

  const setItem = (key: string, value: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!webApp?.SecureStorage) {
        reject(new Error('SecureStorage not available'));
        return;
      }

      webApp.SecureStorage.setItem(key, value, (error, success) => {
        if (error) reject(new Error(error));
        else resolve(success);
      });
    });
  };

  const getItem = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!webApp?.SecureStorage) {
        reject(new Error('SecureStorage not available'));
        return;
      }

      webApp.SecureStorage.getItem(key, (error, value) => {
        if (error) reject(new Error(error));
        else resolve(value);
      });
    });
  };

  const removeItem = (key: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!webApp?.SecureStorage) {
        reject(new Error('SecureStorage not available'));
        return;
      }

      webApp.SecureStorage.removeItem(key, (error, success) => {
        if (error) reject(new Error(error));
        else resolve(success);
      });
    });
  };

  return { setItem, getItem, removeItem };
};
