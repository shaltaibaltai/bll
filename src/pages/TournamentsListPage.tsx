import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { useTelegramWebApp, useTelegramSecureStorage } from '@/hooks/useTelegram';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setAuth, clearAuth } from '@/store/authSlice';
import { Button } from '@/components/ui/Button';
import AddTournamentDialog from '@/components/AddTournamentDialog';
import { Plus, Loader2, Calendar, Trophy, LogOut } from 'lucide-react';
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers';

export default function TournamentsListPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: tournaments, isLoading } = useTournaments();
  const navigate = useNavigate();
  const { webApp } = useTelegramWebApp();
  const { getItem, removeItem } = useTelegramSecureStorage();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(state => state.auth.isAdmin);

  useEffect(() => {
    // Check for saved token
    const checkAuth = async () => {
      try {
        const token = await getItem('admin_token');
        if (token) {
          dispatch(setAuth(token));
        }
      } catch (error) {
        // No token saved
      }
    };
    checkAuth();
  }, [dispatch, getItem]);

  const handleLogout = async () => {
    try {
      await removeItem('admin_token');
      dispatch(clearAuth());
      webApp?.HapticFeedback.notificationOccurred('success');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTournamentClick = (id: string) => {
    webApp?.HapticFeedback.selectionChanged();
    navigate(`/tournament/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Турниры</h1>
              <p className="text-sm text-gray-600">
                {tournaments?.length || 0} активных турниров
              </p>
            </div>
          </div>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-600"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <Button 
            onClick={() => {
              webApp?.HapticFeedback.impactOccurred('light');
              setIsAddDialogOpen(true);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Добавить турнир
          </Button>
        )}

        {/* Tournaments List */}
        <div className="space-y-3">
          {tournaments && tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => handleTournamentClick(tournament.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {tournament.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(tournament.startDate)}</span>
                      </div>
                      {tournament.endDate !== tournament.startDate && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span>{formatDate(tournament.endDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                      tournament.status
                    )}`}
                  >
                    {getStatusLabel(tournament.status)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Турниры пока не добавлены</p>
              {isAdmin && (
                <p className="text-sm text-gray-400 mt-2">
                  Нажмите кнопку выше, чтобы добавить первый турнир
                </p>
              )}
            </div>
          )}
        </div>

        {/* Admin Login Button */}
        {!isAdmin && (
          <Button
            variant="outline"
            onClick={() => navigate('/admin-login')}
            className="w-full"
          >
            Войти как администратор
          </Button>
        )}
      </div>

      <AddTournamentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
