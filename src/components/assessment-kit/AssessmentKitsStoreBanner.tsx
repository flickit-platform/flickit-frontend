import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import ArrowBtn from "@utils/icons/arrow";
import { styles } from "@styles";
import { theme } from "@config/theme";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import uniqueId from "@/utils/uniqueId";

const AssessmentKitsStoreBanner = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<any>(null);
  const startXRef = useRef<number | null>(null);
  const delay = 10000;

  const bannersQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getAllBanners(
        args ?? { lang: i18next.language.toUpperCase() },
        config,
      ),
  });

  const banners: { kitId: number; banner: string }[] = bannersQuery.data ?? [];

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const goNext = () =>
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (!banners.length) return;
    resetTimeout();
    timeoutRef.current = setTimeout(goNext, delay);
    return () => resetTimeout();
  }, [currentIndex, banners]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [banners]);

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startXRef.current === null) return;
    const diff = e.clientX - startXRef.current;
    if (diff > 50) goPrev();
    else if (diff < -50) goNext();
    startXRef.current = null;
  };

  if (bannersQuery.loading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="400px"
        sx={{ borderRadius: 2 }}
      />
    );
  }

  if (!banners.length) return null;

  return (
    <Box
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      sx={{ ...styles.carousel }}
    >
      <Box
        sx={{
          display: "flex",
          width: `${banners.length * 100}%`,
          height: "100%",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(${theme.direction === "rtl" ? "+" : "-"}${currentIndex * (100 / banners.length)}%)`,
        }}
      >
        {banners.map((item, i) => (
          <Box
            key={uniqueId()}
            component="button"
            type="button"
            onClick={() => navigate(`/assessment-kits/${item.kitId}/`)}
            sx={{
              all: "unset",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              display: "block",
            }}
          >
            <img
              src={item.banner}
              alt={`Slide ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        ))}
      </Box>

      <Button
        sx={{
          ...styles.arrow,
          left: "15px",
          transform: "rotate(90deg)",
        }}
        onClick={goPrev}
      >
        <ArrowBtn color={theme.palette.primary.dark} />
      </Button>

      <Button
        sx={{
          ...styles.arrow,
          right: "15px",
          transform: "rotate(-90deg)",
        }}
        onClick={goNext}
      >
        <ArrowBtn color={theme.palette.primary.dark} />
      </Button>

      <Box sx={{ ...styles.dots }}>
        {banners.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: currentIndex === i ? "2rem" : "1rem",
              height: "1rem",
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
    </Box>
  );
};

export default AssessmentKitsStoreBanner;
