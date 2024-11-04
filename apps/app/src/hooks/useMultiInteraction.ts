import { useCallback, useState } from "react";

interface TouchPoint {
  id: number;
  position: { x: number; y: number };
}

interface InteractionState {
  touchPoints: TouchPoint[];
  isMultiTouch: boolean;
}

type InteractionCallback = (
  count: number,
  type: "touch" | "click",
  interactionX: number,
  interactionY: number,
) => void;

export const useMultiInteraction = (onInteraction?: InteractionCallback) => {
  const [interactionState, setInteractionState] = useState<InteractionState>({
    touchPoints: [],
    isMultiTouch: false,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      // Convertir tous les touches actifs avec positions client et page
      const allTouchPoints = Array.from(e.touches).map((touch) => ({
        id: touch.identifier,
        position: {
          x: touch.screenX,
          y: touch.screenY,
        },
      }));

      setInteractionState({
        touchPoints: allTouchPoints,
        isMultiTouch: allTouchPoints.length >= 2,
      });

      // Créer un tableau de positions pour toutes les touches actives
      /*   const positions: Position[] = allTouchPoints.map((point) => ({
        client: point.client,
        page: point.page,
      }));
 */
      allTouchPoints.forEach((point) => {
        onInteraction?.(
          e.touches.length,
          "touch",
          point.position.x,
          point.position.y,
        );
      });
    },
    [onInteraction],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    const updatedPoints = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      position: {
        x: touch.screenX,
        y: touch.screenY,
      },
    }));

    setInteractionState({
      touchPoints: updatedPoints,
      isMultiTouch: updatedPoints.length >= 2,
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    const remainingTouchPoints = Array.from(e.touches).map((touch) => ({
      id: touch.identifier,
      position: {
        x: touch.screenX,
        y: touch.clientY,
      },
    }));

    setInteractionState({
      touchPoints: remainingTouchPoints,
      isMultiTouch: remainingTouchPoints.length >= 2,
    });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onInteraction?.(1, "click", e.pageX, e.pageY);
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
