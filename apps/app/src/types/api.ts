export interface LeaderboardResult {
  rankings: {
    rank: number;
    name: string;
  }[];
}

export interface GameDataResult {
  isInitializationRequired: boolean;
  boss: {
    id: string;
    currentHealth: string;
    isDefeated: boolean;
    baseHealth: string;
  };
  player: {
    attack: string;
    energyCap: string;
    recovery: string;
  };
}

export interface PaymentResponse {
  slug: string;
}
