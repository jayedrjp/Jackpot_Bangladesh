"use client";

import { useRef } from "react";
import clsx from "clsx";

export interface FilterCategory {
  id: string;
  name: string;
}

const DRAG_THRESHOLD_PX = 6;

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: FilterCategory[];
  active: string;
  onChange: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPressed = useRef(false);
  const didDrag = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  // Desktop mouse users get click-and-drag scrolling (no touchscreen to
  // swipe with). Touch keeps using native momentum scrolling untouched.
  //
  // Important: we do NOT call setPointerCapture on pointerdown. A plain
  // click always has a tiny bit of mouse jitter between down and up, so
  // capturing eagerly would occasionally swallow ordinary clicks. Instead
  // we only flip into "dragging" mode (and only then capture the pointer)
  // once movement actually crosses a real threshold.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = scrollRef.current;
    if (!el) return;
    isPressed.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isPressed.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.clientX - startX.current;

    if (!didDrag.current && Math.abs(delta) > DRAG_THRESHOLD_PX) {
      didDrag.current = true;
      el.setPointerCapture(e.pointerId); // only capture once it's a real drag
    }

    if (didDrag.current) {
      el.scrollLeft = startScrollLeft.current - delta;
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    isPressed.current = false;
    if (didDrag.current) {
      scrollRef.current?.releasePointerCapture(e.pointerId);
    }
  }

  // Lets a plain vertical mouse-wheel scroll the row horizontally, so
  // desktop users don't need Shift held down to reach overflow chips.
  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal, let it be
    if (el.scrollWidth <= el.clientWidth) return; // nothing to scroll
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  }

  return (
    <div
      ref={scrollRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none cursor-grab active:cursor-grabbing select-none"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            onClick={() => {
              // A real drag that ended over a chip shouldn't also register
              // as a click — but a plain click (no drag detected) always
              // reaches here now.
              if (didDrag.current) return;
              onChange(cat.id);
            }}
            className={clsx(
              "shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold border transition-all duration-300 hover:scale-[1.04]",
              isActive
                ? "bg-jackpot-red text-white border-jackpot-red shadow-md shadow-jackpot-red/20"
                : "bg-white text-jackpot-black border-black/10 hover:border-jackpot-red/50",
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
