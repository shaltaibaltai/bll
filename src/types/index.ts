export type TournamentStatus = 'upcoming' | 'in_progress' | 'finished';

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  description?: string;
  participants?: number;
  winner?: string;
}

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
}
