import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import Link from "@mui/material/Link";
import { styles } from "@styles";
import { Text } from "@/components/common/Text";

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
      <Text variant="headlineSmall" fontWeight="bold">
        <Trans i18nKey={`${mainTitle}`} />
      </Text>
      <br />
      <Text component="div" variant="bodyMedium" textAlign="justify">
        <Trans i18nKey={`${description}`} />
      </Text>
    </div>
    <Box justifyContent="space-between" mt={4} sx={{ ...styles.centerV }}>
      {hasBtn ? (
        <Link
          href="#new-item"
          sx={{
            ...styles.centerV,
            textDecoration: "none",
            opacity: 0.9,
            fontWeight: "bold",
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
