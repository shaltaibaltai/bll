import { S3Client, HeadBucketCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Tournament } from '@/types';

export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private readonly TOURNAMENTS_KEY = 'tournaments.json';

  constructor(token?: string) {
    if (token) {
      // Admin mode with write access
      const [accessKeyId, secretAccessKey, endpoint, region, bucket] = token.split(':');
      this.bucket = bucket;
      this.s3 = new S3Client({
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        endpoint,
        region,
        forcePathStyle: true,
      });
    } else {
      // Public read-only mode - using anonymous access
      this.bucket = import.meta.env.VITE_PUBLIC_BUCKET || '';
      this.s3 = new S3Client({
        endpoint: import.meta.env.VITE_S3_ENDPOINT || '',
        region: import.meta.env.VITE_S3_REGION || 'eu-central-1',
        forcePathStyle: true,
      });
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async getTournaments(): Promise<Tournament[]> {
    try {
      const response = await this.s3.send(new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.TOURNAMENTS_KEY,
      }));

      if (response.Body) {
        const bodyString = await response.Body.transformToString();
        const tournaments = JSON.parse(bodyString);
        return tournaments;
      }
      return [];
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      const err = error as { name?: string };
      if (err.name === 'NoSuchKey') {
        return [];
      }
      throw error;
    }
  }

  async saveTournaments(tournaments: Tournament[]): Promise<void> {
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.TOURNAMENTS_KEY,
        Body: JSON.stringify(tournaments, null, 2),
        ContentType: 'application/json',
        ACL: 'public-read',
      }));
    } catch (error) {
      console.error('Error saving tournaments:', error);
      throw error;
    }
  }

  async addTournament(tournament: Tournament): Promise<void> {
    const tournaments = await this.getTournaments();
    tournaments.push(tournament);
    await this.saveTournaments(tournaments);
  }

  async updateTournament(tournament: Tournament): Promise<void> {
    const tournaments = await this.getTournaments();
    const index = tournaments.findIndex(t => t.id === tournament.id);
    if (index !== -1) {
      tournaments[index] = tournament;
      await this.saveTournaments(tournaments);
    }
  }

  async deleteTournament(id: string): Promise<void> {
    const tournaments = await this.getTournaments();
    const filtered = tournaments.filter(t => t.id !== id);
    await this.saveTournaments(filtered);
  }
}

// For public access without credentials
export const publicS3Service = new S3Service();
