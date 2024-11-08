export enum GameState {
  LAUNCHED = "LAUNCHED",
  INITIALIZING = "INITIALIZING",
  INITIALIZED = "INITIALIZED",
  ERROR = "ERROR"
}

export interface Boss {
  id: string;
  currentHealth: number;
  baseHealth: number;
}

export interface Player {
  attack: number;
  isInitialized: boolean;
}

export interface GameData {
  boss: Boss;
  player: Player;
  isInitializationRequired: boolean;
}