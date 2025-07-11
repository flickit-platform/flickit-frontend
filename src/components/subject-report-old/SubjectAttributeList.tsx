import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";
import Typography from "@mui/material/Typography";

export const SubjectAttributeList = (props: any) => {
  const { attributes, progress, reloadQuery } = props;
  return (
    <Box mt={5} id="attributes">
      <Typography color="#73808C" variant="semiBoldMedium">
        <Trans i18nKey="common.attributes" />
      </Typography>
      <Box mt={3}>
        {attributes.map((attribute: any = {}) => {
          return (
            <SubjectAttributeCard
              {...attribute}
              maturity_levels_count={attribute.maturityScoreModels.length}
              key={attribute.id}
              progress={progress}
              reloadQuery={reloadQuery}
            />
          );
        })}
      </Box>
    </Box>
  );
};
