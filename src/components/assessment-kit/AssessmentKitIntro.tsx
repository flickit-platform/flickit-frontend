import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/language-detector";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { t } from "i18next";

const MAX_HEIGHT = 200;

const sections = [
  { key: "what", title: "assessmentKit.whatIsThisKit" },
  { key: "who", title: "assessmentKit.whoNeedsThisKit" },
  { key: "when", title: "assessmentKit.whenToUseThisKit" },
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
      const fullHeight = el.scrollHeight + 15;
      setShowBtn(fullHeight > MAX_HEIGHT);
    }, 0);

    return () => clearTimeout(timeout);
  }, [content]);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      borderRadius={2}
      overflow="hidden"
      bgcolor="background.paper"
      border="1px solid"
      borderColor="divider"
      boxShadow="0 0 8px 0 rgba(10, 35, 66, 0.25)"
      minHeight={330}
    >
      <Box
        width={{ md: 120 }}
        borderBottom={{ xs: "1px solid #8DAFD2", md: "none" }}
        sx={{
          ...styles.centerCV,
          [theme.direction === "ltr" ? "borderRight" : "borderLeft"]: {
            md: "1px solid #8DAFD2",
          },
        }}
      >
        {sections.map(({ key }) => {
          const isActive = selected === key;
          return (
            <Box
              key={key}
              onClick={() => setSelected(key)}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flex={1}
              py={2}
              px={1}
              textAlign="center"
              bgcolor={isActive ? "#E5EDF5" : "background.containerLow"}
              color={isActive ? "primary.main" : "text.primary"}
              sx={{
                ...theme.typography.titleMedium,
                cursor: "pointer",
                transition: "all 0.3s ease",
                userSelect: "none",
                "&:not(:last-child)": {
                  borderBottom: "0.5px solid #8DAFD2",
                },
              }}
            >
              {t(`common.${key}`)}
            </Box>
          );
        })}
      </Box>

      {/* Content */}
      <Box flex={1} p={4}>
        <Typography variant="titleLarge" color="text.primary">
          <Trans
            i18nKey={currentSection.title}
            components={{
              primary: <Box component="span" color="primary.main" />,
            }}
          />
        </Typography>

        {/* Main content with fade mask */}
        <Box
          overflow="hidden"
          position="relative"
          maxHeight={!showMore ? `${MAX_HEIGHT}px` : "none"}
          sx={{
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
                    ? `linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%)`
                    : "none",
                  pointerEvents: "none",
                }
              : undefined,
          }}
        >
          <Box
            ref={contentRef}
            color="text.primary"
            textAlign="justify"
            sx={{
              fontFamily: languageDetector(content)
                ? farsiFontFamily
                : primaryFontFamily,
            }}
            dangerouslySetInnerHTML={{
              __html: content || t("common.unavailable"),
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
            {showMore ? t("common.showLess") : t("common.showMore")}...
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AssessmentKitIntro;
