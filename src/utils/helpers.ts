import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TournamentStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTournamentStatus(startDate: string, endDate: string): TournamentStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'finished';
  return 'in_progress';
}

export function getStatusLabel(status: TournamentStatus): string {
  switch (status) {
    case 'upcoming':
      return 'Ожидается';
    case 'in_progress':
      return 'В процессе';
    case 'finished':
      return 'Завершен';
  }
}

export function getStatusColor(status: TournamentStatus): string {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-green-100 text-green-800';
    case 'finished':
      return 'bg-gray-100 text-gray-800';
  }
}
