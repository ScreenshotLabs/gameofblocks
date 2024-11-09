import LevelBossStats from "../level/level-boss-stats";
import { PageTitle } from "../page-title";
import VictoryContinueButton from "./victory-continue-button";
import VictoryLevelsImage from "./victory-levels-image";

export default function BattleVictory() {
  return (
    <div className="bg-[#0C1B3D]">
      <PageTitle>Victory!</PageTitle>
      <div className="mb-10 mt-4 text-center leading-5">
        You successfully defeated your enemy!
        <br />
        You just unlocked a new boss. Keep fighting to earn rewards!
      </div>
      <VictoryLevelsImage />
      <div className="text-game-text mb-4 text-center font-bold uppercase">
        NEW BOSS: BOSSWIFHAT
      </div>
      <LevelBossStats />
      <VictoryContinueButton />
    </div>
  );
}
