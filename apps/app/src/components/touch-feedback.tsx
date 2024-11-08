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
      className="animate-rise pointer-events-none absolute z-30 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 font-bold opacity-50"
      style={{
        left: x - 16,
        top: y - 16,
      }}
    >
      {`-${playerDamage}`}
    </div>
  );
}
