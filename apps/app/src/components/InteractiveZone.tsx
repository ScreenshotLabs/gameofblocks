"use client";

import { useEffect, useState } from "react";
import { useMultiInteraction } from "@/hooks/useMultiInteraction";

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
}) {
  const [elements, setElements] = useState<AnimatedElement[]>([]);
  const [counter, setCounter] = useState(0);

  const { handlers } = useMultiInteraction(
    (_, __, interactionX, interactionY) => {
      const newElement: AnimatedElement = {
        id: counter,
        x: interactionX,
        y: interactionY,
        timestamp: Date.now(),
      };

      setElements((prev) => [...prev, newElement]);
      setCounter((prev) => prev + 1);
      onInteraction?.();
    },
  );

  // Cleanup expired elements
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setElements((prev) =>
        prev.filter((element) => now - element.timestamp < 3000),
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
          <div
            key={element.id}
            className="animate-rise pointer-events-none absolute z-30 h-8 w-8 rounded-full bg-blue-500 opacity-50"
            style={{
              left: element.x - 16,
              top: element.y - 16,
            }}
          ></div>
        ))}
      </div>
    </>
  );
}
