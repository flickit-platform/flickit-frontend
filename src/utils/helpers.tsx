import { useEffect } from "react";

export const getBasePath = (path: string): string => {
  const baseRegex = /^(.*\/graphical-report)(?:\/.*)?$/;
  const baseMatch = baseRegex.exec(path);

  if (baseMatch?.[1]) {
    return `${baseMatch[1]}/`;
  }

  if (path.endsWith("/")) {
    return path;
  }

  return `${path}/`;
};

export const useIntersectOnce = (targetId: string, onHit: () => void) => {
  useEffect(() => {
    let hasHit = false;
    let inter: IntersectionObserver | null = null;

    const setup = (el: HTMLElement) => {
      inter = new IntersectionObserver(
        (entries) => {
          if (!hasHit && entries.some((e) => e.isIntersecting)) {
            hasHit = true;
            onHit();
            inter?.disconnect();
          }
        },
        {
          root: null,
          threshold: 0.5,
          rootMargin: "100px 0px -50px 0px",
        },
      );
      inter.observe(el);
    };

    const el = document.getElementById(targetId);
    if (el) {
      setup(el);
    } else {
      const mo = new MutationObserver(() => {
        const found = document.getElementById(targetId);
        if (found) {
          setup(found);
          mo.disconnect();
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    return () => inter?.disconnect();
  }, [targetId, onHit]);
};
