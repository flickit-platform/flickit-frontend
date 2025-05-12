import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { t } from "i18next";

const MAX_HEIGHT = 210;

const sections = [
  { key: "what", title: "whatIsThisKit" },
  { key: "who", title: "whoNeedsThisKit" },
  { key: "when", title: "whenToUseThisKit" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

interface Props {
  about: string;
  metadata: {
    context?: string;
    goal?: string;
  };
}

const getSectionContent = (
  section: SectionKey,
  about: string,
  metadata: Props["metadata"],
): string => {
  switch (section) {
    case "what":
      return about;
    case "who":
      return metadata.context ?? "";
    case "when":
      return metadata.goal ?? "";
    default:
      return "";
  }
};

const AssessmentKitIntro = ({ about, metadata }: Props) => {
  const theme = useTheme();
  const [selected, setSelected] = useState<SectionKey>("what");

  const content = useMemo(
    () => getSectionContent(selected, about, metadata),
    [selected, about, metadata],
  );

  const currentSection = sections.find((s) => s.key === selected)!;

  const contentRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    setShowMore(false);
  }, [selected]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const timeout = setTimeout(() => {
      const fullHeight = el.scrollHeight;
      setShowBtn(fullHeight > MAX_HEIGHT);
    }, 0);

    return () => clearTimeout(timeout);
  }, [content]);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 0 8px 0 rgba(10, 35, 66, 0.25)",
        minHeight: 330,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          ...styles.centerCV,
          width: { md: 120 },
          [theme.direction === "ltr" ? "borderRight" : "borderLeft"]: {
            md: "1px solid #8DAFD2",
          },
          borderBottom: { xs: "1px solid #8DAFD2", md: "none" },
        }}
      >
        {sections.map(({ key }) => {
          const isActive = selected === key;
          return (
            <Box
              key={key}
              onClick={() => setSelected(key)}
              sx={{
                ...styles.centerCVH,
                flex: 1,
                py: 2,
                px: 1,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isActive
                  ? "#E5EDF5"
                  : theme.palette.primary.light,
                color: isActive ? theme.palette.primary.main : "text.primary",
                fontWeight: isActive ? 600 : 500,
                fontSize: 16,
                transition: "all 0.3s ease",
                userSelect: "none",
                "&:not(:last-child)": {
                  borderBottom: "0.5px solid #8DAFD2",
                },
              }}
            >
              {t(key)}
            </Box>
          );
        })}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="titleLarge" color="#2B333B">
          <Trans
            i18nKey={`assessmentKitTab.${currentSection.title}`}
            components={{
              primary: (
                <Box
                  component="span"
                  sx={{ color: theme.palette.primary.main }}
                />
              ),
            }}
          />
        </Typography>

        {/* Main content with fade mask */}
        <Box
          sx={{
            mt: 2,
            overflow: "hidden",
            position: "relative",
            maxHeight: !showMore ? `${MAX_HEIGHT}px` : "none",
            transition: "max-height 0.4s ease",
            "&::after": !showMore
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40px",
                  background: showBtn
                    ? `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${theme.palette.background.paper} 100%)`
                    : "none",
                  pointerEvents: "none",
                }
              : undefined,
          }}
        >
          <Box
            ref={contentRef}
            sx={{
              fontFamily: languageDetector(content)
                ? farsiFontFamily
                : primaryFontFamily,
              color: "text.primary",
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{
              __html: content || t("unavailable"),
            }}
          />
        </Box>

        {showBtn && (
          <Button
            variant="text"
            onClick={toggleShowMore}
            sx={{
              textTransform: "none",
              mt: 1,
              alignSelf: "flex-start",
              minWidth: "auto",
              paddingX: 0,
            }}
          >
            {showMore ? t("showLess") : t("showMore")}...
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AssessmentKitIntro;
