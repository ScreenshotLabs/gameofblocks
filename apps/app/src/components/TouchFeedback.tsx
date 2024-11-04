export default function TouchFeedback({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="animate-rise pointer-events-none absolute z-30 h-8 w-8 rounded-full bg-blue-500 opacity-50"
      style={{
        left: x - 16,
        top: y - 16,
      }}
    />
  );
}
