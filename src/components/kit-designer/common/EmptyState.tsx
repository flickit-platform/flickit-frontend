import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Tooltip from "@mui/material/Tooltip";
import { ReactElement } from "react";

interface EmptyStateProps {
  onAddNewRow?: () => void;
  btnTitle?: string;
  title: string;
  SubTitle?: string;
  disabled?: boolean;
  disableTextBox?: ReactElement<any, any>;
}

const EmptyState = ({
  onAddNewRow,
  btnTitle,
  title,
  SubTitle,
  disabled,
  disableTextBox,
}: EmptyStateProps) => (
  <Box
    sx={{ ...styles.centerCVH }}
    minHeight={btnTitle ? "180px" : "unset"}
    width="100%"
    gap={2}
  >
    <Typography variant="semiBoldXLarge" color="rgba(61, 77, 92, 0.5)">
      <Trans i18nKey={title} />
    </Typography>
    <Typography variant="bodyMedium">
      <Trans i18nKey={SubTitle} />
    </Typography>
    {btnTitle && (
      <Tooltip disableHoverListener={!disabled} title={disableTextBox}>
        <div>
          <Button variant="contained" onClick={onAddNewRow} disabled={disabled}>
            <Trans i18nKey={btnTitle} />
          </Button>
        </div>
      </Tooltip>
    )}
  </Box>
);

export default EmptyState;
