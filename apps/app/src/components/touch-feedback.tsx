export default function TouchFeedback({
  playerDamage,
  x,
  y,
}: {
  playerDamage: number;
  x: number;
  y: number;
}) {
  return (
    <div
      className="animate-rise text-stroke pointer-events-none absolute z-30 flex text-2xl font-black"
      style={{
        left: x - 16,
        top: y - 16,
      }}
    >
      {playerDamage}
    </div>
  );
}
