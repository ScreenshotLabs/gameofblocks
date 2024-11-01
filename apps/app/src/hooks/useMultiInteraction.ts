import { useCallback, useState } from "react";

interface InteractionState {
  touchCount: number;
  isMultiTouch: boolean;
}

type InteractionCallback = (count: number, type: "touch" | "click") => void;

export const useMultiInteraction = (onInteraction?: InteractionCallback) => {
  const [interactionState, setInteractionState] = useState<InteractionState>({
    touchCount: 0,
    isMultiTouch: false,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touchCount = e.touches.length;
      const isMultiTouch = touchCount >= 2;

      setInteractionState({
        touchCount,
        isMultiTouch,
      });

      if (isMultiTouch) {
        onInteraction?.(touchCount, "touch");
      }
    },
    [onInteraction],
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchCount = e.touches.length;

    setInteractionState({
      touchCount,
      isMultiTouch: touchCount >= 2,
    });
  }, []);

  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      onInteraction?.(1, "click");
    },
    [onInteraction],
  );

  return {
    interactionState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onClick: handleClick,
    },
  };
};
