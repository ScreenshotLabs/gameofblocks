export interface LeaderboardResult {
  rankings: {
    rank: number;
    name: string;
  }[];
}

export interface GameDataResult {
  isInitializationRequired: boolean;
  boss?: {
    id: number;
    currentHealth: string;
    isDefeated: boolean;
    baseHealth: string;
    level: number;
  };
  player: {
    isPremium: boolean;
    attack: number;
    energyCap: string;
    recovery: string;
    gold: number;
  };
}

export interface PaymentResponse {
  slug: string;
}
