"use client";

import { useState } from "react";
import { useMultiInteraction } from "@/hooks/useMultiInteraction";

import TouchFeedback from "./TouchFeedback";

interface AnimatedElement {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function InteractiveZone({
  className,
  children,
  onInteraction,
}: {
  className?: string;
  children?: React.ReactNode;
  onInteraction?: () => void;
  reactionElement?: React.Component;
}) {
  const [elements, setElements] = useState<AnimatedElement[]>([]);

  const { handlers } = useMultiInteraction(
    (_, __, interactionX, interactionY) => {
      const newElement: AnimatedElement = {
        id: Date.now(),
        x: interactionX,
        y: interactionY,
        timestamp: Date.now(),
      };

      setElements((prev) => [...prev, newElement]);
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
      <div className="absolute bottom-0 left-0 right-0 top-0">
        {elements.map((element) => (
          <TouchFeedback x={element.x} y={element.y} key={element.id} />
        ))}
      </div>
    </>
  );
}
