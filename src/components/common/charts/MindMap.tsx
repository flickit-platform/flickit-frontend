import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import { styles } from "@styles";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const width = typeof window !== "undefined" ? window.innerWidth : 1200;
  const centerX = (width - 150) / 2;
  const centerY = isMobile ? 200 : 400;

  const radius = isMobile ? 70 : 200;
  const attributeOffset = isMobile ? 50 : 150;
  const attributeSpacing = isMobile ? 14 : 40;

  const centerSize = isMobile ? 50 : 120;
  const subjectFontSize = isMobile ? "10px" : "12px";
  const attributeFontSize = isMobile ? "9px" : "11px";
  const subjectPadding = isMobile ? "6px 8px" : "8px 12px";
  const attributePadding = isMobile ? "4px 6px" : "6px 10px";

  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];
  const lightColors = [
    theme.palette.primary.light,
    theme.palette.success.light,
    theme.palette.error.light,
    theme.palette.warning.light,
  ];
  const darkColors = [
    theme.palette.primary.dark,
    theme.palette.success.dark,
    theme.palette.error.dark,
    theme.palette.warning.dark,
  ];

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
    const attributes = item[childrenField] || [];
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
    <Box position="relative" width="100%" height={containerHeight} mt={-30}>
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

          const attributes = item[childrenField] || [];
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
            stroke="#ccc"
            strokeWidth={1.5}
            strokeDasharray={key.startsWith("attr") ? "3,3" : "0"}
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
          bgcolor: theme.palette.grey[100],
          border: `2px solid ${theme.palette.grey[400]}`,
          zIndex: 3,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="titleMedium">{title}</Typography>
      </Box>

      {items.map((item, index) => {
        const { x, y } = getPosition(index, items.length);
        const isLeft = x < centerX;
        const attributes = item[childrenField] || [];

        const subjectBgColor = colors[index % colors.length];
        const attributeBgColor = lightColors[index % lightColors.length];
        const attributeTextColor = darkColors[index % darkColors.length];

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
              <Box
                sx={{
                  ...styles.centerV,
                  p: subjectPadding,
                  borderRadius: 2,
                  gap: "4px",
                  fontSize: subjectFontSize,
                  fontWeight: "bold",
                  bgcolor: subjectBgColor,
                  color: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  variant="titleSmall"
                  fontFamily={
                    languageDetector(item[titleField])
                      ? farsiFontFamily
                      : primaryFontFamily
                  }
                >
                  {item[titleField]}
                </Typography>
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
                  <InfoOutlinedIcon fontSize="small" />
                </Tooltip>
              </Box>
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
                  <Box
                    sx={{
                      ...styles.centerV,
                      bgcolor: attributeBgColor,
                      color: attributeTextColor,
                      p: attributePadding,
                      borderRadius: 1,
                      fontSize: attributeFontSize,
                      gap: "4px",
                      minWidth: "100px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="semiBoldSmall"
                      fontFamily={
                        languageDetector(attr[titleField])
                          ? farsiFontFamily
                          : primaryFontFamily
                      }
                    >
                      {attr[titleField]}
                    </Typography>
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
                      <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                  </Box>
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
