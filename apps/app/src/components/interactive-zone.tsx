"use client";

import { useState } from "react";
import { useMultiInteraction } from "@/hooks/useMultiInteraction";

import TouchFeedback from "./touch-feedback";

interface AnimatedElement {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

export default function InteractiveZone({
  className,
  children,
  onInteraction,
  playerDamage,
}: {
  className?: string;
  children?: React.ReactNode;
  onInteraction?: () => void;
  reactionElement?: React.Component;
  playerDamage: number;
}) {
  const [elements, setElements] = useState<AnimatedElement[]>([]);

  const { handlers } = useMultiInteraction(
    (type, interactionX, interactionY) => {
      const id = `${Date.now()}-${interactionX}-${interactionY}`;
      const newElement: AnimatedElement = {
        id,
        x: interactionX,
        y: interactionY,
        timestamp: Date.now(),
      };

      setElements((prev) =>
        [...prev, newElement].filter(
          (element) => element.timestamp > Date.now() - 2000,
        ),
      );

      setTimeout(() => {
        setElements((prev) => prev.filter((num) => num.id !== newElement.id));
      }, 2000);

      onInteraction?.();
    },
  );

  return (
    <>
      <div
        {...handlers}
        className={`relative z-10 ${className}`}
        style={{
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 z-100">
        {elements.map((element) => (
          <TouchFeedback
            playerDamage={playerDamage}
            x={element.x}
            y={element.y}
            key={element.id}
          />
        ))}
      </div>
    </>
  );
}
