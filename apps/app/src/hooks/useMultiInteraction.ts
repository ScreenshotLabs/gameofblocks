import { useCallback, useState } from "react";

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

interface InteractionState {
  touchPoints: TouchPoint[];
  isMultiTouch: boolean;
}

type InteractionCallback = (
  count: number,
  type: "touch" | "click",
  x: number,
  y: number,
) => void;

export const useMultiInteraction = (onInteraction?: InteractionCallback) => {
  const [interactionState, setInteractionState] = useState<InteractionState>({
    touchPoints: [],
    isMultiTouch: false,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      // Convert all active touches (not just the new ones) to TouchPoints
      const allTouchPoints = Array.from(e.touches).map((touch) => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
      }));

      setInteractionState({
        touchPoints: allTouchPoints,
        isMultiTouch: allTouchPoints.length >= 2,
      });

      // Trigger onInteraction for ALL active touches when a new touch starts
      allTouchPoints.forEach((point) => {
        onInteraction?.(e.touches.length, "touch", point.x, point.y);
      });
    },
    [onInteraction],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    setInteractionState((prev) => {
      const updatedPoints = prev.touchPoints.map((point) => {
        const touch = Array.from(e.touches).find(
          (t) => t.identifier === point.id,
        );
        if (touch) {
          return {
            ...point,
            x: touch.clientX,
            y: touch.clientY,
          };
        }
        return point;
      });

      return {
        touchPoints: updatedPoints,
        isMultiTouch: updatedPoints.length >= 2,
      };
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    // Use remaining touches to update state
    const remainingTouchPoints = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));

    setInteractionState({
      touchPoints: remainingTouchPoints,
      isMultiTouch: remainingTouchPoints.length >= 2,
    });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onInteraction?.(1, "click", e.clientX, e.clientY);
    },
    [onInteraction],
  );

  return {
    interactionState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
      onClick: handleClick,
    },
  };
};
