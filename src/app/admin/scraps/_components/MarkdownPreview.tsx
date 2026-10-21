"use client";

import "zenn-content-css";

import { useEffect, useRef } from "react";

function embeddedCardUrl(element: Element): string | null {
  return element.querySelector(".zenn-embedded-card iframe")?.getAttribute("data-content") ?? null;
}

export function MarkdownPreview({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const template = document.createElement("template");
    template.innerHTML = html;
    const nextChildren = Array.from(template.content.children);
    const currentChildren = Array.from(container.children);

    for (const [index, nextChild] of nextChildren.entries()) {
      const currentChild = currentChildren[index];
      if (!currentChild) {
        container.appendChild(nextChild);
        continue;
      }

      const currentCardUrl = embeddedCardUrl(currentChild);
      const nextCardUrl = embeddedCardUrl(nextChild);
      if (
        currentChild.outerHTML === nextChild.outerHTML ||
        (currentCardUrl !== null && currentCardUrl === nextCardUrl)
      ) {
        continue;
      }

      currentChild.replaceWith(nextChild);
    }

    for (const child of currentChildren.slice(nextChildren.length)) {
      child.remove();
    }
  }, [html]);

  return <div ref={containerRef} className="znc" />;
}
