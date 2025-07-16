import React, { useState } from "react";
import { Typography, Button, Box, Stack, Collapse } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded"; // یا هر آیکون دلخواه

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  onEndButtonClick?: () => void;
  endButtonText?: string;
  endButtonIcon?: React.ReactNode;
  defaultExpanded?: boolean;
  sx?: any;
}

const CustomAccordion = styled(Box)(() => ({
  boxShadow: "none",
  background: "transparent",
  border: "none",
}));

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  onEndButtonClick,
  endButtonText = "افزودن",
  endButtonIcon = <AddRoundedIcon fontSize="small" />,
  defaultExpanded = true,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <CustomAccordion {...rest}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        width="100%"
        justifyContent="space-between"
        sx={{ cursor: "pointer", py: 1 }}
        onClick={() => setExpanded((prev) => !prev)}
        mt={1}
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <KeyboardArrowDownRoundedIcon
            sx={{
              transition: "transform 0.2s ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
          <Typography variant="semiBoldXLarge">{title}</Typography>
        </Stack>

        {onEndButtonClick && (
          <Box onClick={(e) => e.stopPropagation()}>
            <Button
              size="medium"
              endIcon={endButtonIcon}
              variant="contained"
              onClick={onEndButtonClick}
            >
              {endButtonText}
            </Button>
          </Box>
        )}
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
        <Box mt={1}>{children}</Box>
      </Collapse>
    </CustomAccordion>
  );
};

export default ExpandableSection;
