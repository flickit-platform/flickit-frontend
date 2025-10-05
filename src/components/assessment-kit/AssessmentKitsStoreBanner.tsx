import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Box, Button, CircularProgress, useTheme } from "@mui/material";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosRounded from "@mui/icons-material/ArrowBackIosRounded";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { styles } from "@styles";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";

interface Banner {
  kitId: number;
  smallBanner: string;
  largeBanner: string;
}

interface GradientArrowProps {
  onClick: () => void;
  side: "left" | "right";
  Icon: React.ReactNode;
}

const GradientArrow: React.FC<GradientArrowProps> = ({
  onClick,
  side,
  Icon,
}) => (
  <Button
    onClick={onClick}
    sx={{
      ...styles.centerV,
      position: "absolute",
      top: 0,
      [side]: 0,
      width: "10%",
      height: "100%",
      background: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgba(27, 77, 126, 0.3), transparent)`,
      zIndex: 3,
      borderRadius: 0,
      "&:hover": {
        background: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgba(27, 77, 126, 0.4), transparent)`,
      },
      justifyContent:
        (side === "left" && i18next.language === "en") ||
        (side === "right" && i18next.language === "fa")
          ? "flex-start"
          : "flex-end",
      color: "primary.dark",
    }}
  >
    {Icon}
  </Button>
);

const useAutoplay = (enabled: boolean, delayMs: number, onTick: () => void) => {
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const loop = (ts: number) => {
      startRef.current ??= ts;
      if (ts - startRef.current >= delayMs) {
        onTick();
        startRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
    };
  }, [enabled, delayMs, onTick]);
};

const decodeImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    // @ts-ignore
    if (img.decode) {
      // @ts-ignore
      img
        .decode()
        .then(() => resolve())
        .catch(() => resolve());
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });

const AssessmentKitsStoreBanner = (props: any) => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const { mobileScreen } = props;

  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  const [allReady, setAllReady] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [dragPct, setDragPct] = useState(0);

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const AUTOPLAY_DELAY = 8000;

  const { data = [], loading } = useQuery<Banner[]>({
    service: (args, config) =>
      service.assessmentKit.info.getAllBanners(
        args ?? { lang: i18next.language.toUpperCase() },
        config,
      ),
  });

  const banners: Banner[] = data;
  const images = useMemo(
    () =>
      banners
        .map((b) => (mobileScreen ? b.smallBanner : b.largeBanner))
        .filter(Boolean),
    [banners, mobileScreen],
  );

  useEffect(() => {
    setLoaded((prev) =>
      Array.from({ length: images.length }, (_, i) => prev[i] ?? false),
    );
    setAllReady(false);
  }, [images.length]);

  useEffect(() => {
    if (!images.length) return;
    const toPreload = new Set<number>([
      currentIndex,
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ]);
    toPreload.forEach(async (i) => {
      await decodeImage(images[i]);
      setLoaded((prev) => {
        if (prev[i]) return prev;
        const next = [...prev];
        next[i] = true;
        return next;
      });
    });
  }, [currentIndex, images]);

  useEffect(() => {
    if (!images.length) return;
    const loadedCount = loaded.filter(Boolean).length;
    if (loadedCount >= Math.min(2, images.length)) setAllReady(true);
  }, [loaded, images.length]);

  const DIRECTION = theme.direction === "rtl" ? "+" : "-";
  const basePct = images.length ? currentIndex * (100 / images.length) : 0;
  const appliedPct =
    (DIRECTION === "+" ? 1 : -1) * (basePct + (dragging ? dragPct : 0));

  const clampIndex = useCallback(
    (idx: number) => {
      const last = images.length - 1;
      if (idx < 0) return last;
      if (idx > last) return 0;
      return idx;
    },
    [images.length],
  );
  const goTo = useCallback(
    (idx: number) => setCurrentIndex(() => clampIndex(idx)),
    [clampIndex],
  );
  const goNext = useCallback(
    () => goTo(currentIndex + 1),
    [currentIndex, goTo],
  );
  const goPrev = useCallback(
    () => goTo(currentIndex - 1),
    [currentIndex, goTo],
  );

  useAutoplay(
    images.length > 1 && !loading && !dragging,
    AUTOPLAY_DELAY,
    goNext,
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey as any, { passive: true } as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [goNext, goPrev]);

  useEffect(() => {
    const root = carouselRef.current;
    if (!root) return;

    let startX = 0;
    let dx = 0;
    let tracking = false;

    const onDown = (e: PointerEvent) => {
      tracking = true;
      startX = e.clientX;
      dx = 0;
      setDragging(true);
      setDragPct(0);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!tracking) return;
      dx = e.clientX - startX;
      const width = root.clientWidth || 1;
      const pctViewport = (dx / width) * 100;
      setDragPct((DIRECTION === "+" ? 1 : -1) * pctViewport);
    };

    const onUp = () => {
      if (!tracking) return;
      tracking = false;
      const width = root.clientWidth || 1;
      const swiped = Math.abs(dx) > width * 0.15;
      setDragging(false);
      setDragPct(0);
      if (swiped) {
        const swipedLeft = dx < 0;
        swipedLeft ? goNext() : goPrev();
      }
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, [DIRECTION, goNext, goPrev]);

  if (!loading && (!banners.length || !images.length)) return null;

  const goToKit = (kitId: number) => navigate(`/assessment-kits/${kitId}/`);

  return (
    <Box
      ref={carouselRef}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor: "action.hover",
        willChange: "transform",
        contain: "content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: {
            xs: `${images.length * 100}%`,
            sm: `${images.length * 100}%`,
          },
          height: "100%",
          transition: dragging ? "none" : "transform 420ms ease",
          transform: `translate3d(${appliedPct}%, 0, 0)`,
          willChange: "transform",
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        {banners.map((item, i) => {
          const src = mobileScreen ? item.smallBanner : item.largeBanner;
          const isLoaded = loaded[i];
          return (
            <Box
              key={item.kitId}
              component="button"
              type="button"
              onClick={() => goToKit(item.kitId)}
              sx={{ all: "unset", cursor: "pointer", position: "relative", width: "100%", height:"100%", paddingInlineStart: 2 }}
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                onLoad={() =>
                  setLoaded((prev) => {
                    if (prev[i]) return prev;
                    const next = [...prev];
                    next[i] = true;
                    return next;
                  })
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: isLoaded ? 1 : 0,
                  transition: "opacity 260ms ease",
                }}
              />
              {!isLoaded && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(2px)",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.16))",
                  }}
                >
                  <CircularProgress size={28} />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {(loading || !allReady) && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.16))",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!mobileScreen && images.length > 1 && (
        <>
          <GradientArrow
            onClick={goPrev}
            side="left"
            Icon={<ArrowBackIosRounded fontSize="large" />}
          />
          <GradientArrow
            onClick={goNext}
            side="right"
            Icon={<ArrowForwardIosRounded fontSize="large" />}
          />
        </>
      )}

      {images.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 10,
            display: "flex",
            gap: 1,
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          {banners.map((_b, i) => {
            const active = i === currentIndex;
            return (
              <Box
                key={banners[i]?.kitId ?? i}
                component="span"
                onClick={() => setCurrentIndex(i)}
                sx={{
                  width: active ? "2rem" : "1rem",
                  height: "0.75rem",
                  bgcolor: active ? "background.onVariant" : "#668099",
                  borderRadius: active ? "20px" : "50%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: active ? 1 : 0.7,
                  transform: active ? "scale(1.3)" : "scale(1)",
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AssessmentKitsStoreBanner;
