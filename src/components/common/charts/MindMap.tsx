import React, { useLayoutEffect, useRef, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import { generateColorFromString, styles } from "@styles";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

interface MindMapProps {
  items: any[];
  childrenField: string;
  title: string;
  idField?: string;
  titleField?: string;
  descriptionField?: string;
}

const MindMap: React.FC<MindMapProps> = ({
  items,
  childrenField,
  idField = "id",
  titleField = "title",
  descriptionField = "description",
  title,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1200,
    height: 600,
  });

  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const width = containerSize.width;
  const centerX = width / 2;
  const centerY = 170;

  const radius = isMobile ? 70 : 150;
  const attributeOffset = isMobile ? 50 : 120;
  const attributeSpacing = isMobile ? 14 : 40;

  const centerSize = isMobile ? 50 : 130;
  const subjectFontSize = isMobile ? "10px" : "12px";
  const attributeFontSize = isMobile ? "9px" : "11px";
  const subjectPadding = isMobile ? "6px 8px" : "8px 12px";
  const attributePadding = isMobile ? "4px 6px" : "6px 10px";

  const getPosition = (index: number, total: number) => {
    if (total === 1) return { x: centerX + radius, y: centerY };
    if (total === 2)
      return { x: centerX + (index === 0 ? -radius : radius), y: centerY };
    if (total === 3) {
      const angles = [0, Math.PI, Math.PI / 2];
      const angle = angles[index];
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    }
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const subjectHeights = items.map((item, index) => {
    const { y } = getPosition(index, items.length);
    const attributes = item[childrenField] ?? [];
    const lastAttrY = attributes.length
      ? y + ((attributes.length - 1) / 2) * attributeSpacing
      : y;
    return lastAttrY;
  });
  const maxY = Math.max(...subjectHeights, centerY);
  const containerHeight = maxY + 70;

  const allLines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    key: string;
  }[] = [];

  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      height={containerHeight}
    >
      <Box
        component="svg"
        position="absolute"
        width="100%"
        height="100%"
        zIndex={1}
      >
        {items.map((item, index) => {
          const { x, y } = getPosition(index, items.length);
          allLines.push({
            x1: centerX,
            y1: centerY,
            x2: x,
            y2: y,
            key: `center-${item[idField]}`,
          });

          const attributes = item[childrenField] ?? [];
          attributes.forEach((attr: any, i: number) => {
            const attrX =
              x + (x < centerX ? -attributeOffset : attributeOffset);
            const attrY =
              y + (i - (attributes.length - 1) / 2) * attributeSpacing;
            allLines.push({
              x1: x,
              y1: y,
              x2: attrX,
              y2: attrY,
              key: `attr-${attr[idField]}`,
            });
          });

          return null;
        })}
        {allLines.map(({ x1, y1, x2, y2, key }) => (
          <line
            key={key}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={theme.palette.surface.contrastTextVariant}
            strokeWidth={key.startsWith("attr") ? 0.91 : 2.23}
          />
        ))}
      </Box>

      <Box
        position="absolute"
        top={centerY}
        left={centerX}
        sx={{
          ...styles.centerCVH,
          transform: "translate(-50%, -50%)",
          width: centerSize,
          height: centerSize,
          borderRadius: "50%",
          bgcolor: "color(srgb 0.9276 0.9376 0.9461)",
          border: `2px solid ${theme.palette.surface.contrastTextVariant}`,
          zIndex: 3,
          textAlign: "center",
          p:2
        }}
      >
        <Typography variant="titleMedium" color={theme.palette.surface.contrastTextVariant}>
          {title}
        </Typography>
      </Box>

      {items.map((item, index) => {
        const { x, y } = getPosition(index, items.length);
        const isLeft = x < centerX;
        const attributes = item[childrenField] ?? [];
        return (
          <React.Fragment key={`subject-${item[idField]}`}>
            <Box
              position="absolute"
              top={y}
              left={x}
              sx={{
                transform: "translate(-50%, -50%)",
                zIndex: 3,
              }}
            >
              <Tooltip
                title={
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: languageDetector(item[descriptionField])
                        ? farsiFontFamily
                        : primaryFontFamily,
                    }}
                  >
                    {item[descriptionField]}
                  </Typography>
                }
              >
                <Box
                  sx={{
                    ...styles.centerV,
                    p: subjectPadding,
                    borderRadius: 2,
                    gap: "4px",
                    fontSize: subjectFontSize,
                    fontWeight: "bold",
                    bgcolor: generateColorFromString(item[titleField])
                      .backgroundColor,
                    color: generateColorFromString(item[titleField]).color,
                  }}
                >
                  <Typography
                    variant="titleSmall"
                    fontFamily={
                      languageDetector(item[titleField])
                        ? farsiFontFamily
                        : primaryFontFamily
                    }
                    sx={{
                      maxWidth: "180px",
                      wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {item[titleField]}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>

            {attributes.map((attr: any, i: number) => {
              const attrX = x + (isLeft ? -attributeOffset : attributeOffset);
              const attrY =
                y + (i - (attributes.length - 1) / 2) * attributeSpacing;

              return (
                <Box
                  key={`attr-${attr[idField]}`}
                  position="absolute"
                  top={attrY}
                  left={attrX}
                  sx={{
                    transform: `translate(${isLeft ? "-100%" : "0"}, -50%)`,
                    zIndex: 2,
                  }}
                >
                  <Tooltip
                    title={
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: languageDetector(attr[descriptionField])
                            ? farsiFontFamily
                            : primaryFontFamily,
                        }}
                      >
                        {attr[descriptionField]}
                      </Typography>
                    }
                  >
                    <Box
                      sx={{
                        ...styles.centerV,
                        bgcolor: generateColorFromString(item[titleField])
                          .backgroundColor,
                        color: generateColorFromString(item[titleField]).color,
                        p: attributePadding,
                        borderRadius: 1,
                        fontSize: attributeFontSize,
                        gap: "4px",
                        minWidth: "100px",
                      }}
                    >
                      <Typography
                        variant="semiBoldSmall"
                        fontFamily={
                          languageDetector(attr[titleField])
                            ? farsiFontFamily
                            : primaryFontFamily
                        }
                        sx={{
                          maxWidth: "180px",
                          wordBreak: "break-word",
                          textAlign: "center",
                        }}
                      >
                        {attr[titleField]}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              );
            })}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default MindMap;
