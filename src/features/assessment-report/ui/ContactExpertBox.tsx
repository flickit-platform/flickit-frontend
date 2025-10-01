"use client";
import { Box, Button, useTheme } from "@mui/material";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { styles } from "@styles";
import { blue } from "@/config/colors";
import { Text } from "@/components/common/Text";

type Props = Readonly<{
  lng: string;
  rtl: boolean;
  onOpen: () => void;
}>;

export default function ContactExpertBox({ lng, rtl, onOpen }: Props) {
  const theme = useTheme();
  const points = t("assessmentReport.contactExpertBoxText.points", {
    lng,
    returnObjects: true,
  }) as string[];

  return (
    <Box
      p={2}
      borderRadius={2}
      bgcolor={blue[95]}
      flexShrink={0}
      sx={{ ...styles.rtlStyle(rtl) }}
      width="100%"
    >
      <Text
        variant="bodySmall"
        textAlign="justify"
        fontFamily="inherit"
        display="block"
      >
        <Trans
          i18nKey="assessmentReport.contactExpertBoxText.intro"
          components={{ strong: <strong /> }}
          t={(key: any, options?: any) => t(key, { lng, ...options })}
        />
      </Text>

      <ul
        style={{
          listStyle: "none",
          paddingInline: 8,
          ...(theme.typography.bodySmall as any),
          fontFamily: "inherit",
          textAlign: "justify",
        }}
      >
        {points.map((item, idx) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>

      <Text
        variant="bodySmall"
        textAlign="justify"
        fontFamily="inherit"
        display="block"
      >
        {t("assessmentReport.contactExpertBoxText.outro", { lng })}
      </Text>

      <Button
        size="medium"
        onClick={onOpen}
        variant="contained"
        sx={{
          mt: 2,
          width: "100%",
          background: `linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)`,
          color: "background.containerLowest",
          boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
          "&:hover": {
            background: `linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)`,
            opacity: 0.9,
          },
          ...styles.rtlStyle(rtl),
        }}
      >
        {t("assessmentReport.contactExpertGroup", { lng })}
      </Button>
    </Box>
  );
}
