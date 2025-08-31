import { Paper, PaperProps, Typography, Box } from "@mui/material";
import { styles } from "@styles";
import { ReactNode } from "react";

interface SectionCardProps extends PaperProps {
  title?: any;
  desc?: ReactNode;
  rtl?: boolean;
  icon?: any;
}

export default function SectionCard({
  id,
  title,
  desc,
  rtl = false,
  children,
  icon,
  ...rest
}: Readonly<SectionCardProps>) {
  return (
    <Paper
      id={id}
      elevation={3}
      sx={{
        ...styles.centerCV,
        borderRadius: "16px",
        boxShadow: "none",
        padding: { xs: 2, md: 4 },
        textAlign: rtl ? "right" : "left",
      }}
      {...rest}
    >
      {title && (
        <Box width="100%" display="flex" flexDirection="column" gap={2}>
          <Box sx={{ ...styles.centerV }} gap={1}>
            {icon}
            <Typography
              component="div"
              variant="headlineSmall"
              color="primary.main"
              fontWeight="bold"
              whiteSpace="pre-line"
              sx={{ ...styles.rtlStyle(rtl) }}
            >
              {title}
            </Typography>
          </Box>
          {desc && (
            <Typography
              variant="bodyMedium"
              whiteSpace="pre-line"
              textAlign="justify"
              sx={{ ...styles.rtlStyle(rtl) }}
            >
              {desc}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Paper>
  );
}
