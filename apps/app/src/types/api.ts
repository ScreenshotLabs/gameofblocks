export interface LeaderboardResult {
  rankings: {
    rank: number;
    name: string;
  }[];
}

export interface PlayResult {
  monster: {
    life: number;
  };
}

export interface PaymentResponse {
  slug: string;
}
