import type { PropsWithChildren } from "react";

export function PageTitle({ children }: PropsWithChildren) {
  return (
    <div className="text-game-text mt-10 text-center text-2xl font-bold uppercase">
      {children}
    </div>
  );
}
