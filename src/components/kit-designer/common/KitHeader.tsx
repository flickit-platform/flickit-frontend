import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import Link from "@mui/material/Link";

interface KitDesignerHeaderProps {
  onAddNewRow: () => void;
  mainTitle: string;
  description: string;
  hasBtn: boolean;
  btnTitle: string;
}

const KitDesignerHeader = ({
  mainTitle,
  description,
  hasBtn,
  onAddNewRow,
  btnTitle,
}: KitDesignerHeaderProps) => (
  <>
    <div id="maturity-header">
      <Typography variant="headlineSmall" fontWeight="bold">
        <Trans i18nKey={`${mainTitle}`} />
      </Typography>
      <br />
      <Typography component="div" variant="bodyMedium" textAlign="justify">
        <Trans i18nKey={`${description}`} />
      </Typography>
    </div>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={4}
    >
      {hasBtn ? (
        <Link
          href="#new-item"
          sx={{
            textDecoration: "none",
            opacity: 0.9,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            marginInlineStart: "auto",
          }}
        >
          <Button variant="contained" onClick={onAddNewRow}>
            <Trans i18nKey={btnTitle} />
          </Button>
        </Link>
      ) : null}
    </Box>{" "}
  </>
);

export default KitDesignerHeader;
