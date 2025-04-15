import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import ArrowBtn from "@utils/icons/arrow";
import { styles } from "@styles";
import { theme } from "@config/theme";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";

const AssessmentKitsStoreBanner = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<any>(null);
  const startXRef = useRef<number | null>(null);
  const delay = 10000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const nextImage = (data: any[]) => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (data: any[]) => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent, data: any[]) => {
    if (startXRef.current === null) return;
    const diff = e.clientX - startXRef.current;
    if (diff > 50) prevImage(data);
    else if (diff < -50) nextImage(data);
    startXRef.current = null;
  };

  const bannersQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getAllBanners(
        args ?? { lang: i18next.language.toUpperCase() },
        config,
      ),
  });

  return (
    <QueryData
      {...bannersQuery}
      render={(data) => {
        const banners: { kitId: number; banner: string }[] = data || [];

        useEffect(() => {
          resetTimeout();
          timeoutRef.current = setTimeout(() => {
            nextImage(banners);
          }, delay);

          return () => resetTimeout();
        }, [currentIndex, banners]);

        useEffect(() => {
          const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevImage(banners);
            else if (e.key === "ArrowRight") nextImage(banners);
          };
          window.addEventListener("keydown", handleKeyDown);
          return () => window.removeEventListener("keydown", handleKeyDown);
        }, [banners]);

        return (
          <Box
            onMouseDown={handleMouseDown}
            onMouseUp={(e) => handleMouseUp(e, banners)}
            sx={{ ...styles.carousel }}
          >
            <Box
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              sx={{ ...styles.carouselInner }}
            >
              {banners.map((item, i) => (
                <img
                  key={i}
                  src={item.banner}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  alt={`Slide ${i + 1}`}
                  onClick={() => navigate(`/assessment-kits/${item.kitId}/`)}
                />
              ))}
            </Box>

            <Button
              sx={{
                ...styles.arrow,
                left: "15px",
                transform: "rotate(90deg)",
              }}
              onClick={() => prevImage(banners)}
            >
              <ArrowBtn color={theme.palette.primary.dark} />
            </Button>

            <Button
              sx={{
                ...styles.arrow,
                right: "15px",
                transform: "rotate(-90deg)",
              }}
              onClick={() => nextImage(banners)}
            >
              <ArrowBtn color={theme.palette.primary.dark} />
            </Button>

            <Box sx={{ ...styles.dots }}>
              {banners.map((_, i) => (
                <Box
                  key={i}
                  className={`dot ${currentIndex === i ? "active" : ""}`}
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
      }}
      loadingComponent={
        <Skeleton
          variant="rectangular"
          width="100%"
          height="400px"
          sx={{ borderRadius: 2 }}
        />
      }
    />
  );
};

export default AssessmentKitsStoreBanner;
