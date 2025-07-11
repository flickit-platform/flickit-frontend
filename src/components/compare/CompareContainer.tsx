import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import CompareParts from "./CompareParts";
import { CompareProvider } from "@providers/CompareProvider";

const CompareContainer = () => {
  return (
    <Box>
      <Title size="large" borderBottom={true}>
        <Trans i18nKey="compare.compare" />
      </Title>
      <Box mt={3}>
        <CompareProvider>
          <CompareParts />
        </CompareProvider>
      </Box>
    </Box>
  );
};

export default CompareContainer;
