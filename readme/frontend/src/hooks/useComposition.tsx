import { useCallback, useRef } from "react";

export interface UseCompositionOptions<T extends HTMLElement> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

export function useComposition<T extends HTMLElement>({
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
}: UseCompositionOptions<T> = {}) {
  const isComposing = useRef(false);

  const handleCompositionStart = useCallback(
    (e: React.CompositionEvent<T>) => {
      isComposing.current = true;
      onCompositionStart?.(e);
    },
    [onCompositionStart]
  );

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<T>) => {
      isComposing.current = false;
      onCompositionEnd?.(e);
    },
    [onCompositionEnd]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<T>) => {
      onKeyDown?.(e);
    },
    [onKeyDown]
  );

  return {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
    isComposing,
  };
}
