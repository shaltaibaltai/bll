import AWS from 'aws-sdk';
import { Tournament } from '@/types';

export class S3Service {
  private s3: AWS.S3;
  private bucket: string;
  private readonly TOURNAMENTS_KEY = 'tournaments.json';

  constructor(token?: string) {
    if (token) {
      // Admin mode with write access
      const [accessKeyId, secretAccessKey, endpoint, region, bucket] = token.split(':');
      this.bucket = bucket;
      this.s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      });
    } else {
      // Public read-only mode - using anonymous access
      // You'll need to set the bucket URL for public access
      this.bucket = import.meta.env.VITE_PUBLIC_BUCKET || '';
      this.s3 = new AWS.S3({
        endpoint: import.meta.env.VITE_S3_ENDPOINT || '',
        region: import.meta.env.VITE_S3_REGION || 'eu-central-1',
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      });
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.s3.headBucket({ Bucket: this.bucket }).promise();
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async getTournaments(): Promise<Tournament[]> {
    try {
      const data = await this.s3.getObject({
        Bucket: this.bucket,
        Key: this.TOURNAMENTS_KEY,
      }).promise();

      if (data.Body) {
        const tournaments = JSON.parse(data.Body.toString('utf-8'));
        return tournaments;
      }
      return [];
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      if ((error as AWS.AWSError).code === 'NoSuchKey') {
        return [];
      }
      throw error;
    }
  }

  async saveTournaments(tournaments: Tournament[]): Promise<void> {
    try {
      await this.s3.putObject({
        Bucket: this.bucket,
        Key: this.TOURNAMENTS_KEY,
        Body: JSON.stringify(tournaments, null, 2),
        ContentType: 'application/json',
        ACL: 'public-read', // Make it publicly readable
      }).promise();
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
