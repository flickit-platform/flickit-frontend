import { Text } from "@/components/common/Text";
import { Box } from "@mui/material";
import React from "react";

const pillStyle = {
  px: 2,
  py: 0.5,
  borderRadius: 1,
  border: "1px solid",
  borderColor: "outline.variant",
  bgcolor: "primary.bg",
  color: "primary.main",
  width: "fit-content",
};

export const InfoField = React.memo(function InfoField({
  label,
  value,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <>
      <Text variant="titleSmall" sx={{ mb: 1 }}>
        {label}
      </Text>
      <Box sx={pillStyle}>
        <Text variant="bodyMedium">{value}</Text>
      </Box>
    </>
  );
});
