export interface LeaderboardResult {
  rankings: {
    rank: number;
    name: string;
  }[];
}

export interface GameDataResult {
  isInitializationRequired: boolean;
  monster: {
    id: number;
    life: number;
  };
}

export interface PaymentResponse {
  slug: string;
}
