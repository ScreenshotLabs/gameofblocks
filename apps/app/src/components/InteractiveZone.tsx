"use client";

import { useState } from "react";
import { useMultiInteraction } from "@/hooks/useMultiInteraction";

export default function InteractiveZone({
  className,
  children,
  onInteraction,
}: {
  className?: string;
  children?: React.ReactNode;
  onInteraction: () => void;
}) {
  const [interactionCount, setInteractionCount] = useState(0);
  const { handlers, interactionState } = useMultiInteraction(
    (interactionCount, _interactionType) => {
      onInteraction();
      setInteractionCount((prevValue) => prevValue + interactionCount);
    },
  );

  return (
    <div
      {...handlers}
      className={className}
      style={{
        userSelect: "none",
        touchAction: "none",
      }}
    >
      Count: {interactionCount}
      {interactionState.isMultiTouch && (
        <div className="fixed bottom-4 right-4 rounded bg-blue-500 px-4 py-2 text-white">
          {interactionState.touchCount} touches detected
        </div>
      )}
      {children}
    </div>
  );
}
