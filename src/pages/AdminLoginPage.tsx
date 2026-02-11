import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/authSlice';
import { useTelegramSecureStorage, useTelegramWebApp } from '@/hooks/useTelegram';
import { S3Service } from '@/services/s3Service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setItem } = useTelegramSecureStorage();
  const { webApp } = useTelegramWebApp();

  const handleLogin = async () => {
    if (!token.trim()) {
      setError('Пожалуйста, введите токен');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const s3Service = new S3Service(token);
      const isValid = await s3Service.validateToken();

      if (!isValid) {
        setError('Неверный токен. Проверьте данные.');
        webApp?.HapticFeedback.notificationOccurred('error');
        return;
      }

      await setItem('admin_token', token);
      dispatch(setAuth(token));
      webApp?.HapticFeedback.notificationOccurred('success');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка валидации токена. Попробуйте снова.');
      webApp?.HapticFeedback.notificationOccurred('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Вход администратора</h1>
            <p className="text-gray-600 mt-2">Введите токен доступа к S3</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Токен S3
              </label>
              <Input
                type="password"
                placeholder="accessKey:secretKey:endpoint:region:bucket"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
                className="font-mono text-xs"
              />
              {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
              <p className="text-xs text-gray-500 mt-1.5">
                Формат: accessKeyId:secretAccessKey:endpoint:region:bucket
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
