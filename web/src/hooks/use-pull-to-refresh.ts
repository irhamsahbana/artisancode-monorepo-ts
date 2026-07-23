import { useEffect, useRef, useState } from "react";

import type { RefObject } from "react";

const PULL_THRESHOLD = 70;
const MAX_PULL = 120;
const RESISTANCE = 0.5;

// ponytail: gesture math lives in refs (not state) so onTouchMove/onTouchEnd
// always read the latest value without re-binding listeners every frame.
export function usePullToRefresh(
  containerRef: RefObject<HTMLElement | null>,
  onRefresh: () => Promise<unknown>,
) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const currentPull = useRef(0);
  const isRefreshing = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || el.scrollTop > 0 || isRefreshing.current) {
        startY.current = null;
        return;
      }
      startY.current = touch.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (startY.current === null || !touch) return;
      const delta = touch.clientY - startY.current;
      if (delta <= 0) {
        currentPull.current = 0;
        setPullDistance(0);
        return;
      }
      e.preventDefault();
      const next = Math.min(delta * RESISTANCE, MAX_PULL);
      currentPull.current = next;
      setPullDistance(next);
    };

    const onTouchEnd = async () => {
      if (startY.current === null) return;
      startY.current = null;

      if (currentPull.current < PULL_THRESHOLD) {
        currentPull.current = 0;
        setPullDistance(0);
        return;
      }

      isRefreshing.current = true;
      setRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      try {
        await onRefresh();
      } finally {
        isRefreshing.current = false;
        currentPull.current = 0;
        setRefreshing(false);
        setPullDistance(0);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef, onRefresh]);

  return { pullDistance, refreshing, threshold: PULL_THRESHOLD };
}
