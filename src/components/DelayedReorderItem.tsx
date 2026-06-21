import { Reorder, useDragControls } from 'framer-motion';
import { useRef, useCallback, type ReactNode } from 'react';

const LONG_PRESS_MS = 450;
const MOVE_THRESHOLD = 10;

interface Props<T> {
  value: T;
  children: ReactNode;
  className?: string;
  whileDrag?: {
    scale?: number;
    zIndex?: number;
    boxShadow?: string;
  };
  transition?: { duration?: number };
}

export default function DelayedReorderItem<T>({
  value,
  children,
  className,
  whileDrag,
  transition,
}: Props<T>) {
  const controls = useDragControls();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;

      if (e.pointerType === 'mouse') {
        controls.start(e);
        return;
      }

      startRef.current = { x: e.clientX, y: e.clientY };
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        controls.start(e);
      }, LONG_PRESS_MS);
    },
    [controls]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!timerRef.current || !startRef.current) return;
      const dx = Math.abs(e.clientX - startRef.current.x);
      const dy = Math.abs(e.clientY - startRef.current.y);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        clearTimer();
      }
    },
    [clearTimer]
  );

  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      className={className}
      whileDrag={whileDrag}
      transition={transition}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </Reorder.Item>
  );
}
