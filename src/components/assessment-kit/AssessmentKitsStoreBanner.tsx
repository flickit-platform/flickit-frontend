import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Skeleton } from "@mui/material";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosRounded from "@mui/icons-material/ArrowBackIosRounded";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { styles } from "@styles";
import { theme } from "@config/theme";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";
import uniqueId from "@/utils/uniqueId";

const DIRECTION = theme.direction === "rtl" ? "+" : "-";
const ARROW_COLOR = "#1B4D7E";

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
      position: "absolute",
      top: 0,
      [side]: 0,
      width: "10%",
      height: "100%",
      background: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgba(27, 77, 126, 0.3), transparent)`,
      zIndex: 2,
      borderRadius: 0,
      "&:hover": {
        background: `linear-gradient(to ${side === "left" ? "right" : "left"}, rgba(27, 77, 126, 0.4), transparent)`,
      },
      display: "flex",
      alignItems: "center",
      justifyContent:
        (side === "left" && i18next.language === "en") ||
        (side === "right" && i18next.language === "fa")
          ? "flex-start"
          : "flex-end",
      color: ARROW_COLOR,
    }}
  >
    {Icon}
  </Button>
);

const AssessmentKitsStoreBanner = (props: any) => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const { mobileScreen } = props;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number | null>(null);
  const delay = 10000;

  const { data = [], loading } = useQuery<Banner[]>({
    service: (args, config) =>
      service.assessmentKit.info.getAllBanners(
        args ?? { lang: i18next.language.toUpperCase() },
        config,
      ),
  });

  const banners = data;

  useEffect(() => {
    setLoadedImages(new Array(banners.length).fill(false));
  }, [banners.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goTo = (index: number) => {
    const last = banners.length - 1;
    setCurrentIndex(index < 0 ? last : index > last ? 0 : index);
  };

  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  useEffect(() => {
    resetTimeout();
    if (banners.length > 0) {
      timeoutRef.current = setTimeout(goNext, delay);
    }
    return resetTimeout;
  }, [currentIndex, banners.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [banners.length]);

  const handleSwipe = (startX: number, endX: number) => {
    const diff = endX - startX;
    if (diff > 50) goPrev();
    else if (diff < -50) goNext();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startXRef.current !== null) {
      handleSwipe(startXRef.current, e.clientX);
      startXRef.current = null;
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  if (mobileScreen && !banners.some((kit) => !!kit.smallBanner)) return null;
  if (!mobileScreen && !banners.some((kit) => !!kit.largeBanner)) return null;

  return (
    <Box
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      sx={styles.carousel}
    >
      {loading ||
      !banners.length ||
      (loadedImages.length > 0 && !loadedImages[currentIndex]) ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="34vh"
          sx={{ borderRadius: 2 }}
        />
      ) : null}

      <Box
        sx={{
          display: "flex",
          width: `${banners.length * 95}%`,
          height: "100%",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(${DIRECTION}${currentIndex * (100 / banners.length)}%)`,
        }}
      >
        {banners.map((item, i) => (
          <Box
            key={item.kitId}
            component="button"
            type="button"
            onClick={() => navigate(`/assessment-kits/${item.kitId}/`)}
            sx={{
              all: "unset",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              display: "block",
              paddingInlineStart: 2,
            }}
          >
            <img
              src={mobileScreen ? item.smallBanner : item.largeBanner}
              alt={`Slide ${i + 1}`}
              onLoad={() => handleImageLoad(i)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: loadedImages[i] ? "block" : "none",
              }}
            />
          </Box>
        ))}
      </Box>

      {!mobileScreen && (
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
          <Box sx={styles.dots}>
            {banners.map((_, i) => (
              <Box
                key={uniqueId()}
                sx={{
                  width: currentIndex === i ? "2rem" : "1rem",
                  height: "0.75rem",
                  backgroundColor: currentIndex === i ? "#6C8093" : "#668099",
                  borderRadius: currentIndex === i ? "20px" : "50%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: currentIndex === i ? 1 : 0.7,
                  transform: currentIndex === i ? "scale(1.3)" : "scale(1)",
                }}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AssessmentKitsStoreBanner;
