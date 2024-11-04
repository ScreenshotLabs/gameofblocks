export default function TouchFeedback({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="animate-rise pointer-events-none absolute z-30 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 font-bold opacity-50"
      style={{
        left: x - 16,
        top: y - 16,
      }}
    >
      -1
    </div>
  );
}
