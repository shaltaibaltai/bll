import { useParams, useNavigate } from 'react-router-dom';
import { useTournaments } from '@/hooks/useTournaments';
import { useTelegramWebApp } from '@/hooks/useTelegram';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Loader2, Trophy, Users } from 'lucide-react';
import { formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers';

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tournaments, isLoading } = useTournaments();
  const { webApp } = useTelegramWebApp();

  const tournament = tournaments?.find((t) => t.id === id);

  const handleBack = () => {
    webApp?.HapticFeedback.impactOccurred('light');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto pt-20 text-center">
          <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Турнир не найден</h2>
          <p className="text-gray-600 mb-6">Этот турнир был удален или не существует</p>
          <Button onClick={handleBack}>Вернуться к списку</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>

        {/* Tournament Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    tournament.status
                  )}`}
                >
                  {getStatusLabel(tournament.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Tournament Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Дата начала</p>
                <p className="font-semibold text-gray-900">{formatDate(tournament.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-xs text-gray-500">Дата окончания</p>
                <p className="font-semibold text-gray-900">{formatDate(tournament.endDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {tournament.description && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Описание</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{tournament.description}</p>
          </div>
        )}

        {tournament.participants && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Участников</p>
                <p className="text-2xl font-bold text-gray-900">{tournament.participants}</p>
              </div>
            </div>
          </div>
        )}

        {tournament.winner && tournament.status === 'finished' && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-sm p-6 border border-yellow-200">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-700 font-medium">Победитель</p>
                <p className="text-xl font-bold text-gray-900">{tournament.winner}</p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder sections */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Участники</h2>
          <p className="text-gray-500 text-center py-8">Информация об участниках скоро появится</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Сетка турнира</h2>
          <p className="text-gray-500 text-center py-8">Сетка турнира будет доступна позже</p>
        </div>
      </div>
    </div>
  );
}
