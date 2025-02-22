import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { Tooltip } from "@mui/material";
import { ReactElement } from "react";

interface EmptyStateProps {
  onAddNewRow: () => void;
  btnTitle: string;
  title: string;
  subTitle?: string;
  disabled?: boolean;
  disableTextBox?: ReactElement<any, any>;
}

const TextContent = ({
  textKey,
  variant,
  color,
  fontWeight,
}: {
  textKey: string;
  variant: "headlineSmall" | "bodyMedium";
  color?: string;
  fontWeight?: string | number;
}) => (
  <Typography variant={variant} fontWeight={fontWeight} color={color}>
    <Trans i18nKey={textKey} />
  </Typography>
);

const EmptyAdviceList = ({
  onAddNewRow,
  btnTitle,
  title,
  subTitle,
  disabled = false,
  disableTextBox,
}: EmptyStateProps) => (
  <Box sx={{ ...styles.centerCVH }} minHeight="180px" gap={2}>
    <TextContent
      textKey={title}
      variant="headlineSmall"
      fontWeight="bold"
      color="rgba(61, 77, 92, 0.5)"
    />
    <TextContent textKey={subTitle} variant="bodyMedium" />
    <Tooltip disableHoverListener={!disabled} title={disableTextBox}>
      <div>
        <Button variant="contained" onClick={onAddNewRow} disabled={disabled}>
          <Trans i18nKey={btnTitle} />
        </Button>
      </div>
    </Tooltip>
  </Box>
);

export default EmptyAdviceList;
