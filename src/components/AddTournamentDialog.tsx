import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAddTournament } from '@/hooks/useTournaments';
import { useTelegramWebApp } from '@/hooks/useTelegram';
import { generateId, getTournamentStatus } from '@/utils/helpers';
import { Tournament } from '@/types';

interface AddTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddTournamentDialog({ open, onOpenChange }: AddTournamentDialogProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { webApp } = useTelegramWebApp();
  const addMutation = useAddTournament();

  const handleSubmit = async () => {
    if (!name.trim() || !startDate) {
      webApp?.HapticFeedback.notificationOccurred('error');
      return;
    }

    const tournament: Tournament = {
      id: generateId(),
      name: name.trim(),
      startDate,
      endDate: endDate || startDate,
      status: getTournamentStatus(startDate, endDate || startDate),
    };

    try {
      await addMutation.mutateAsync(tournament);
      webApp?.HapticFeedback.notificationOccurred('success');
      setName('');
      setStartDate('');
      setEndDate('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add tournament:', error);
      webApp?.HapticFeedback.notificationOccurred('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить турнир</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Название турнира</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              className="mt-1.5"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Дата начала</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Дата окончания</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={addMutation.isPending}
              className="flex-1"
            >
              {addMutation.isPending ? 'Добавление...' : 'Добавить'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
