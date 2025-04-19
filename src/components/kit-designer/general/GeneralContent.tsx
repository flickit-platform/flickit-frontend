import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PermissionControl from "../../common/PermissionControl";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { IKitVersion } from "@/types/index";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "@/utils/useQuery";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";

const GeneralContent = () => {
  return (
    <PermissionControl>
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="general" />
          </Typography>
        </Box>
        <Typography variant="bodyMedium">
          <Trans i18nKey="kitDesignerTab.generalDescription" />
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="end" alignItems="center">
          <Button variant="contained">
            <Trans i18nKey="saveChanges" />
          </Button>
        </Box>
      </>
    </PermissionControl>
  );
};

export default GeneralContent;
