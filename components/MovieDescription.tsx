"use client";

import { useState, useRef, useEffect } from "react";

interface MovieDescriptionProps {
  html: string;
}

const COLLAPSED_HEIGHT = 120;

export default function MovieDescription({ html }: MovieDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsCollapse(contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 20);
    }
  }, [html]);

  return (
    <div className="max-w-3xl">
      <div
        className="relative overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded || !needsCollapse ? "none" : `${COLLAPSED_HEIGHT}px`,
        }}
      >
        <div
          ref={contentRef}
          className="text-[16px] font-[Inter] text-on-surface-variant leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && needsCollapse && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      {needsCollapse && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-[14px] font-[Inter] font-semibold text-secondary hover:text-on-surface transition-colors"
        >
          {expanded ? (
            <>
              Thu gọn
              <span className="material-symbols-outlined text-[18px]">expand_less</span>
            </>
          ) : (
            <>
              Xem thêm
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
