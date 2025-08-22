import { Paper, PaperProps, Typography, Box } from "@mui/material";
import { styles } from "@styles";
import { ReactNode } from "react";

interface SectionCardProps extends PaperProps {
  title?: any;
  desc?: ReactNode;
  rtl?: boolean;
}

export default function SectionCard({
  title,
  desc,
  rtl = false,
  children,
  ...rest
}: SectionCardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        ...styles.centerCV,
        borderRadius: "16px",
        boxShadow: "none",
        paddingBlock: 2,
        paddingInline: 2.5,
        textAlign: rtl ? "right" : "left",
      }}
      {...rest}
    >
      {title && (
        <Box width="100%" display="flex" flexDirection="column" gap={2}>
          <Typography
            component="div"
            variant="headlineSmall"
            color="primary.main"
            fontWeight="bold"
            sx={{ ...styles.rtlStyle(rtl) }}
          >
            {title}
          </Typography>
          {desc && (
            <Typography variant="bodyMedium" sx={{ ...styles.rtlStyle(rtl) }}>
              {desc}
            </Typography>
          )}
        </Box>
      )}

      {children}
    </Paper>
  );
}
