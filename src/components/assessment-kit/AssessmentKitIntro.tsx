import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { t } from "i18next";

const sections = [
  {
    key: "what",
    label: "What",
    title: "whatIsThisKit",
  },
  {
    key: "who",
    label: "Who",
    title: "whoNeedsThisKit",
  },
  {
    key: "when",
    label: "When",
    title: "whenToUseThisKit",
  },
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

  const paragraphRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>(280);

  useEffect(() => {
    setShowMore(false);
  }, [selected]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (paragraphRef.current) {
        const fullHeight = paragraphRef.current.scrollHeight;
        const defaultMaxHeight = 280;
        setMaxHeight(defaultMaxHeight);
        setShowBtn(fullHeight > defaultMaxHeight);
      }
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
        {sections.map(({ key, label }) => {
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
              {label}
            </Box>
          );
        })}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        {/* Section title with colored keyword */}
        <Typography variant="titleLarge" color="surface">
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

        {/* Main content */}
        <Typography
          key={selected}
          ref={paragraphRef}
          component="div"
          sx={{
            mt: 2,
            color: "text.primary",
            overflow: "hidden",
            maxHeight: showBtn && !showMore ? `${maxHeight}px` : "none",
            transition: "max-height 0.3s ease",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            fontFamily: languageDetector(content)
              ? farsiFontFamily
              : primaryFontFamily,
            textAlign: "justify",
          }}
          dangerouslySetInnerHTML={{
            __html: content !== "" ? content : t("unavailable"),
          }}
        />

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
